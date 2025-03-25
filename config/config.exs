import Config

if Mix.env() == :dev do
  esbuild = fn args ->
    [
      args: ~w(./js/osm --bundle --loader:.png=file) ++ args,
      cd: Path.expand("../assets", __DIR__),
      env: %{"NODE_PATH" => Path.expand("../deps", __DIR__)}
    ]
  end

  osm_vsn = Mix.Project.config()[:version]

  config :esbuild,
    version: "0.25.0",
    module:
      esbuild.(
        ~w(--format=esm --sourcemap --define:OSM_VSN="#{osm_vsn}" --outfile=../priv/static/osm.esm.js)
      ),
    main:
      esbuild.(
        ~w(--format=cjs --sourcemap --define:OSM_VSN="#{osm_vsn}" --outfile=../priv/static/osm.cjs.js)
      ),
    cdn:
      esbuild.(
        ~w(--format=iife --target=es2016 --global-name=OSM --define:OSM_VSN="#{osm_vsn}" --outfile=../priv/static/osm.js)
      ),
    cdn_min:
      esbuild.(
        ~w(--format=iife --target=es2016 --global-name=OSM --minify --define:OSM_VSN="#{osm_vsn}" --outfile=../priv/static/osm.min.js)
      )
end
