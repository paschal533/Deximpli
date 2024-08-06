#include "gtest/gtest.h"

#include <arpa/inet.h>
#include <errno.h>
#include <netdb.h>
#include <netinet/in.h>
#include <sys/socket.h>
#include <sys/types.h>
#include <unistd.h>

#include <pistache/http.h>
#include <pistache/listener.h>
class SocketWrapper {

public:
  explicit SocketWrapper(int fd) : fd_(fd) {}
  ~SocketWrapper() { close(fd_); }

  uint16_t port() {
    sockaddr_in sin;
    socklen_t len = sizeof(sin);

    uint16_t port = 0;
    if (getsockname(fd_, (struct sockaddr *)&sin, &len) == -1) {
      perror("getsockname");
    } else {
      port = ntohs(sin.sin_port);
    }
    return port;
  }

private:
  int fd_;
};

// Just there for show.
class DummyHandler : public Pistache::Http::Handler {
public:
  HTTP_PROTOTYPE(DummyHandler)

  void onRequest(const Pistache::Http::Request &request,
                 Pistache::Http::ResponseWriter response) override {
    UNUSED(request);
    response.send(Pistache::Http::Code::Ok, "I am a dummy handler\n");
  }
};

/*
 * Will try to get a free port by binding port 0.
 */
SocketWrapper bind_free_port() {
  int sockfd; // listen on sock_fd, new connection on new_fd
  addrinfo hints, *servinfo, *p;

  int yes = 1;
  int rv;

  memset(&hints, 0, sizeof hints);
  hints.ai_family = AF_UNSPEC;
  hints.ai_socktype = SOCK_STREAM;
  hints.ai_flags = AI_PASSIVE; // use my IP

  if ((rv = getaddrinfo(nullptr, "0", &hints, &servinfo)) != 0) {
    std::cerr << "getaddrinfo: " << gai_strerror(rv) << "\n";
    exit(1);
  }

  // loop through all the results and bind to the first we can
  for (p = servinfo; p != nullptr; p = p->ai_next) {
    if ((sockfd = socket(p->ai_family, p->ai_socktype, p->ai_protocol)) == -1) {
      perror("server: socket");
      continue;
    }

    if (setsockopt(sockfd, SOL_SOCKET, SO_REUSEADDR, &yes, sizeof(int)) == -1) {
      perror("setsockopt");
      exit(1);
    }

    if (bind(sockfd, p->ai_addr, p->ai_addrlen) == -1) {
      close(sockfd);
      perror("server: bind");
      continue;
    }

    break;
  }

  freeaddrinfo(servinfo); // all done with this structure

  if (p == nullptr) {
    fprintf(stderr, "server: failed to bind\n");
    exit(1);
  }
  return SocketWrapper(sockfd);
}

TEST(listener_test, listener_bind_port_free) {
  uint16_t port_nb;

  // This is just done to get the value of a free port. The socket will be
  // closed after the closing curly bracket and the port will be free again
  // (SO_REUSEADDR option). In theory, it is possible that some application grab
  // this port before we bind it again...
  {
    SocketWrapper s = bind_free_port();
    port_nb = s.port();
  }

  if (port_nb == 0) {
    FAIL() << "Could not find a free port. Abort test.\n";
  }

  Pistache::Port port(port_nb);
  Pistache::Address address(Pistache::Ipv4::any(), port);

  Pistache::Tcp::Listener listener;
  Pistache::Flags<Pistache::Tcp::Options> options;
  listener.init(1, options);
  listener.setHandler(Pistache::Http::make_handler<DummyHandler>());
  listener.bind(address);
  ASSERT_TRUE(true);
}

// Listener should not crash if an additional member is added to the listener
// class. This test is there to prevent regression for PR 303
TEST(listener_test, listener_uses_default) {
  uint16_t port_nb;

  // This is just done to get the value of a free port. The socket will be
  // closed after the closing curly bracket and the port will be free again
  // (SO_REUSEADDR option). In theory, it is possible that some application grab
  // this port before we bind it again...
  {
    SocketWrapper s = bind_free_port();
    port_nb = s.port();
  }

  if (port_nb == 0) {
    FAIL() << "Could not find a free port. Abort test.\n";
  }

  Pistache::Port port(port_nb);
  Pistache::Address address(Pistache::Ipv4::any(), port);

  Pistache::Tcp::Listener listener;
  listener.setHandler(Pistache::Http::make_handler<DummyHandler>());
  listener.bind(address);
  ASSERT_TRUE(true);
}

TEST(listener_test, listener_bind_port_not_free_throw_runtime) {

  SocketWrapper s = bind_free_port();
  uint16_t port_nb = s.port();

  if (port_nb == 0) {
    FAIL() << "Could not find a free port. Abort test.\n";
  }

  Pistache::Port port(port_nb);
  Pistache::Address address(Pistache::Ipv4::any(), port);

  Pistache::Tcp::Listener listener;
  Pistache::Flags<Pistache::Tcp::Options> options;
  listener.init(1, options);
  listener.setHandler(Pistache::Http::make_handler<DummyHandler>());

  try {
    listener.bind(address);
    FAIL() << "Expected std::runtime_error while binding, got nothing";
  } catch (std::runtime_error const &err) {
    std::cout << err.what() << std::endl;
    int flag = 0;
    // GNU libc
    if (strncmp(err.what(), "Address already in use",
                sizeof("Address already in use")) == 0) {
      flag = 1;
    }
    // Musl libc
    if (strncmp(err.what(), "Address in use", sizeof("Address in use")) == 0) {
      flag = 1;
    }
    ASSERT_EQ(flag, 1);
  } catch (...) {
    FAIL() << "Expected std::runtime_error";
  }
}

// Listener should be able to bind port 0 directly to get an ephemeral port.
TEST(listener_test, listener_bind_ephemeral_v4_port) {
  Pistache::Port port(0);
  Pistache::Address address(Pistache::Ipv4::any(), port);

  Pistache::Tcp::Listener listener;
  listener.setHandler(Pistache::Http::make_handler<DummyHandler>());
  listener.bind(address);

  Pistache::Port bound_port = listener.getPort();
  ASSERT_TRUE(bound_port > (uint16_t)0);
}

TEST(listener_test, listener_bind_ephemeral_v6_port) {
  Pistache::Tcp::Listener listener;
  if (Pistache::Ipv6::supported()) {
    Pistache::Port port(0);
    Pistache::Address address(Pistache::Ipv6::any(), port);

    Pistache::Flags<Pistache::Tcp::Options> options;
    listener.setHandler(Pistache::Http::make_handler<DummyHandler>());
    listener.bind(address);

    Pistache::Port bound_port = listener.getPort();
    ASSERT_TRUE(bound_port > (uint16_t)0);
  }
  ASSERT_TRUE(true);
}
