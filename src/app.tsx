import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { Rows, Columns, Button, TextInput, Checkbox, Select } from "@canva/app-ui-kit";
import { upload } from "@canva/asset";
import {
  addElementAtPoint,
  createRichtextRange,
  getCurrentPageContext,
  selection
} from "@canva/design";
import { searchProducts } from "./supabase";
import { Product } from "./types";
import { BRAND_LABEL_PREFIX } from "./brandFonts";
// import * as styles from "./styles/components.css";
const styles = { scrollContainer: "scroll-container" }; // Temporary placeholder

/** Utility to add [image + (optional) brand label] as a grouped element */
async function insertProductWithOptionalLabel(
  product: Product,
  opts: { showBrandLabel: boolean }
) {
  // 1) Upload product image to Canva and insert
  const img = await upload({
    type: "image",
    mimeType: "image/jpeg",
    url: product.image_url,
    thumbnailUrl: product.image_url, // quick placeholder
    aiDisclosure: "none"
  }); // create image asset (ref)
  // Docs: upload + addElementAtPoint. :contentReference[oaicite:9]{index=9}

  // If label is OFF, just drop the image at cursor/center
  if (!opts.showBrandLabel) {
    await addElementAtPoint({
      type: "image",
      ref: img.ref,
      altText: { text: `${product.brand} - ${product.name}`, decorative: false }
    });
    return;
  }

  // 2) Build a richtext label with a recognizable prefix
  const label = createRichtextRange();
  label.appendText(`${BRAND_LABEL_PREFIX} `, { fontWeight: "bold" });
  label.appendText(product.brand);

  // 3) Insert a GROUP containing [image, label] and position label near image
  // Use relative coordinates inside group. Docs: grouping/positioning. :contentReference[oaicite:10]{index=10}
  await addElementAtPoint({
    type: "group",
    children: [
      {
        type: "image",
        ref: img.ref,
        width: 160,
        height: "auto",
        top: 0,
        left: 0,
        altText: { text: `${product.brand} - ${product.name}`, decorative: false }
      },
      {
        type: "richtext",
        range: label,
        width: 160,
        top: 170,     // place below image; Canva will scale relative units
        left: 0
      }
    ]
  });
}

/** Bulk update of *brand labels* only (prefixed with BRAND_LABEL_PREFIX) */
async function bulkUpdateBrandLabelFonts() {
  // TODO: Implement bulk font update functionality
  // This will use Canva's Content Querying API to find and update brand labels
  console.log("Bulk font update clicked - functionality to be implemented");
}

function App() {
  const [q, setQ] = React.useState("");
  const [color, setColor] = React.useState<string | undefined>(undefined);
  const [type, setType] = React.useState<string | undefined>(undefined);
  const [results, setResults] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [showBrandLabel, setShowBrandLabel] = React.useState(true);

  async function doSearch() {
    setLoading(true);
    try {
      const items = await searchProducts({ q, color, type });
      setResults(items || []);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.scrollContainer}>
      <Rows spacing="2u">
        <TextInput
          placeholder="Search brand or product..."
          value={q}
          onChange={(v) => setQ(v)}
        />
        <Columns spacing="1u">
          <Select
            placeholder="Color"
            value={color ?? ""}
            onChange={(v) => setColor(v || undefined)}
            options={[
              { value: "", label: "Any" },
              { value: "beige", label: "Beige" },
              { value: "black", label: "Black" },
              { value: "white", label: "White" }
            ]}
          />
          <Select
            placeholder="Type"
            value={type ?? ""}
            onChange={(v) => setType(v || undefined)}
            options={[
              { value: "", label: "Any" },
              { value: "vase", label: "Vase" },
              { value: "lamp", label: "Lamp" },
              { value: "rug", label: "Rug" }
            ]}
          />
        </Columns>
        <Checkbox
          checked={showBrandLabel}
          onChange={(_value, checked) => setShowBrandLabel(checked)}
          label="Add brand label near product"
        />
        <Button variant="primary" onClick={doSearch} disabled={loading} stretch>
          {loading ? "Searching..." : "Search"}
        </Button>

        {results.map((p) => (
          <Rows spacing="1u" key={p.id}>
            <div style={{ fontWeight: 600 }}>{p.brand}</div>
            <div>{p.name}</div>
            <Columns spacing="1u">
              <Button
                variant="secondary"
                onClick={() => insertProductWithOptionalLabel(p, { showBrandLabel })}
              >
                Insert into design
              </Button>
              <Button variant="tertiary" onClick={() => window.open(p.shop_url, "_blank")}>
                View product
              </Button>
            </Columns>
            <div style={{ height: 1, background: "#eee" }} />
          </Rows>
        ))}

        <Button variant="secondary" onClick={bulkUpdateBrandLabelFonts} stretch>
          Bulk-update brand label fonts
        </Button>
      </Rows>
    </div>
  );
}

// Render the app
const container = document.getElementById("root");
if (container) {
  const root = ReactDOM.createRoot(container);
  root.render(<App />);
}