# Open Street Map

Provides a Phoenix component for Open Street Map using Leaflet JS.

## Installation

The installation unfortunately isn't super simple at this time due to npm dependencies being needed.

First install the `:osm` package in your mix.exs file.

```elixir
def deps do
  [
    {:osm, "~> 0.1.0"}
  ]
end
```

### Add OSM to your Phoenix project.

Add `import OSM` to your `html_helpers/1` macro in your app's web main file, e.g. myapp_web.ex.

```elixir
defp html_helpers do
  quote do
    # HTML escaping functionality
    import Phoenix.HTML
    # Core UI components and translation
    import MyAppWeb.CoreComponents
    import MyAppWeb.Gettext

    import OSM # <~ Add this line

    # Shortcut for generating JS commands
    alias Phoenix.LiveView.JS

    # Routes generation with the ~p sigil
    unquote(verified_routes())
  end
end
```

Add the OSM hook to your JavaScript app.js file.
```javascript
import {OSM} from "osm"

...

// Modify your liveSocket line to include the hook
let liveSocket = new LiveSocket("/live", Socket, {params: {_csrf_token: csrfToken}, hooks: {OSM}})
```

### Install Leaflet.js

Then you will need to install the leaflet dependency.

```bash
cd assets && npm add leaflet
```

Edit your esbuild config to allow loading of png files and look in the node_modules folder.

If you are using an umbrella project it will be slightly different paths (see example below).

```elixir
# Add to the args
--loader:.png=file

# Set the env option to
%{
  "NODE_PATH" =>
    Enum.join(
      [
        Path.expand("../deps", __DIR__),
        Path.expand("../assets/node_modules", __DIR__)
      ],
      ":"
    )
}
```

```elixir
config :esbuild,
  version: "0.17.11",
  default: [
    args:
      ~w(js/app.js --bundle --target=es2017 --outdir=../priv/static/assets --external:/fonts/* --external:/images/* --loader:.png=file),
    cd: Path.expand("../assets", __DIR__),
    env: %{
      "NODE_PATH" =>
        Enum.join(
          [
            Path.expand("../deps", __DIR__),
            Path.expand("../assets/node_modules", __DIR__)
          ],
          ":"
        )
    }
  ]

# Or in an umbrella
config :esbuild,
  version: "0.17.11",
  default: [
    args:
      ~w(js/app.js --bundle --target=es2017 --outdir=../priv/static/assets --external:/fonts/* --external:/images/* --loader:.png=file),
    cd: Path.expand("../apps/myapp_web/assets", __DIR__),
    env: %{
      "NODE_PATH" =>
        Enum.join(
          [
            Path.expand("../deps", __DIR__),
            Path.expand("../apps/myapp_web/assets/node_modules", __DIR__)
          ],
          ":"
        )
    }
  ]
```

Add the leaflet css import in your app.css file (if in an umbrella project this is the one inside your phoenix app, not the overall project one).
```css
@import "leaflet";
```
