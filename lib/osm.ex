defmodule OSM do
  @moduledoc """
  Render OSM Component
  """

  use Phoenix.Component

  @doc """
  Renders an OSM map

  ## Examples

      iex> OSM.hello()
      :world

  """
  attr(:id, :string, required: true)
  attr(:style, :string, default: "light_all")

  slot :marker do
    attr(:latitude, :float, required: true)
    attr(:longitude, :float, required: true)
    attr(:radius, :integer)
    attr(:type, :string)
    attr(:properties, :string)
  end

  attr(:rest, :global)

  def map(assigns) do
    ~H"""
    <div id={@id} phx-hook="OSM" data-style={@style} {@rest} style="display: none;">
      <div  
        :for={marker <- @marker} 
        data-latitude={marker.latitude} 
        data-longitude={marker.longitude} 
        data-radius={Map.get(marker, :radius)} 
        data-type={Map.get(marker, :type)} 
        data-properties={Map.get(marker, :properties)}
        >
        <%= if not is_nil(Map.get(marker, :inner_block)), do: render_slot(marker), else: "" %>
      </div>
    </div>
    <div id={"#{@id}-osm"} phx-update="ignore">
      <div id={"#{@id}-osm-map"} style="min-height: 300px;"></div>
    </div>
    """
  end
end
