// Shows the angle from vertical between two selected points in the Fontra glyph editor.
const ID = "fontra-angle.two-points";

export function start(editor) {
  editor.visualizationLayers.definitions.push({
    identifier: ID,
    name: "Angle between two points",
    selectionFunc: (visContext) => visContext.glyphsBySelectionMode.editing || [],
    zIndex: 700,
    screenParameters: { fontSize: 10, offset: 8, haloWidth: 3 },
    colors: { text: "#666", haloColor: "#FFF" },
    colorsDarkMode: { text: "#AAA", haloColor: "#1E1E1E" },
    draw: ({ context, positionedGlyph, parameters: p, model }) => {
      const indices = [...(model.selection || [])]
        .filter((item) => item.startsWith("point/"))
        .map((item) => Number(item.slice(6)));
      if (indices.length !== 2) return;
      const [a, b] = indices.map((i) => positionedGlyph.glyph.path.getPoint(i));
      if (!a || !b) return;
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const angle = (Math.atan2(Math.abs(dx), Math.abs(dy)) * 180) / Math.PI;
      const label = `${Math.round(angle * 10) / 10}°`;

      // Place the label beside the midpoint, perpendicular to the line
      const length = Math.hypot(dx, dy) || 1;
      const x = (a.x + b.x) / 2 + (dy / length) * p.offset;
      const y = (a.y + b.y) / 2 - (dx / length) * p.offset;

      context.scale(1, -1);
      context.font = `${p.fontSize}px fontra-ui-regular, sans-serif`;
      context.textAlign = dy === 0 ? "center" : dy > 0 ? "left" : "right";
      context.textBaseline = "middle";
      context.lineJoin = "round";
      context.lineWidth = p.haloWidth;
      context.strokeStyle = p.haloColor;
      context.fillStyle = p.text;
      context.strokeText(label, x, -y);
      context.fillText(label, x, -y);
    },
  });
  editor.visualizationLayers.toggle(ID, true);
}
