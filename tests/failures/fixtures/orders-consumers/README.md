# Orders consumers (synthetic fixture for FC-0002)

Three hand-written files: an ASP.NET Core endpoint `GET api/orders/{id}`, an
Angular admin service that calls it through a typed `Order` interface, and a
storefront helper that calls it by URL string and reads `status`. Nothing here
is built, restored or run. Developer-only; never shipped.
