// Shared category list. Every page that used to hardcode its own
// "Trekking / Nature / Heritage / ..." array now imports this instead, so
// adding a category only means editing one file.
export interface Category {
  id: string; // matches Destination.category exactly, e.g. "Nature"
  label: string;
  icon: string; // emoji, cheap stand-in for an icon set
}
