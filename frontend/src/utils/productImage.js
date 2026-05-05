import fallbackProductImage from "../assets/products/yoghurt-family-cutout.png";

export const productFallbackImage = fallbackProductImage;

const productAssetContext = require.context(
  "../assets/products",
  false,
  /\.(png|jpe?g|webp|avif)$/i
);

const productAssetMap = productAssetContext.keys().reduce((assets, key) => {
  const filename = key.replace("./", "").replace(/\.[^.]+$/, "");
  if (filename === "yoghurt-family-cutout") return assets;
  assets[normalizeImageKey(filename)] = productAssetContext(key);
  return assets;
}, {});

function normalizeImageKey(value = "") {
  return String(value)
    .toLowerCase()
    .replace(/yogurt/g, "yoghurt")
    .replace(/youghurt/g, "yoghurt")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function getNamedProductAsset(product) {
  const candidates = [
    product?.name,
    product?.productId,
    ...(Array.isArray(product?.altNames) ? product.altNames : []),
  ];

  for (const candidate of candidates) {
    const key = normalizeImageKey(candidate);
    if (productAssetMap[key]) return productAssetMap[key];

    const partialMatch = Object.entries(productAssetMap).find(([assetKey]) => {
      return assetKey.includes(key) || key.includes(assetKey);
    });
    if (partialMatch) return partialMatch[1];
  }

  return null;
}

export function getProductImage(product, index = 0) {
  const namedAsset = getNamedProductAsset(product);
  if (namedAsset) return namedAsset;

  const images = Array.isArray(product?.images) ? product.images.filter(Boolean) : [];
  return images[index] || product?.image || product?.productId?.images?.[index] || fallbackProductImage;
}

export function getProductImages(product) {
  const namedAsset = getNamedProductAsset(product);
  if (namedAsset) return [namedAsset];

  const images = Array.isArray(product?.images) ? product.images.filter(Boolean) : [];
  return images.length > 0 ? images : [fallbackProductImage];
}

export function handleProductImageError(event) {
  if (event.currentTarget.src !== fallbackProductImage) {
    event.currentTarget.src = fallbackProductImage;
  }
}
