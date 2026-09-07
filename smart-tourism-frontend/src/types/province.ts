// Top level of the Province -> City -> Category -> Destination hierarchy
// (and the parallel Province -> City -> Hotels / Province -> Region ->
// TrekkingRoute relationships) described in the data-architecture request.
export interface Province {
  id: string; // stable slug, e.g. "bagmati"
  name: string; // display name, e.g. "Bagmati"
  capital: string;
  description: string;
}
