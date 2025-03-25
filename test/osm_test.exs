defmodule OsmTest do
  use ExUnit.Case
  doctest Osm

  test "greets the world" do
    assert Osm.hello() == :world
  end
end
