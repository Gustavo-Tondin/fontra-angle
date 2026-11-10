// Shows the angle between two selected points in the Fontra glyph editor.
const ID = "fontra-angle.two-points";

const round = (v) => Math.round(v * 10) / 10;

export function start(editor) {
  editor.visualizationLayers.definitions.push({
    identifier: ID,
    name: "Angle between two points",
    selectionFunc: (visContext) => visContext.glyphsBySelectionMode.editing || [],
    zIndex: 700,
    screenParameters: { fontSize: 11, strokeWidth: 1, dash: 4 },
    colors: { line: "#E5484D", box: "#FFFFFFE6", text: "#000" },
    colorsDarkMode: { box: "#111111E6", text: "#FFF" },
    draw: ({ context, positionedGlyph, parameters: p, model }) => {
      const indices = [...(model.selection || [])]
        .filter((item) => item.startsWith("point/"))
        .map((item) => Number(item.slice(6)));
      if (indices.length !== 2) return;
      const path = positionedGlyph.glyph.path;
      const points = indices.map((i) => path.getPoint(i));
      if (points.some((pt) => !pt)) return;
      // Bottom point first, so a positive dx means the line leans right going up
      const [a, b] = points.sort((m, n) => m.y - n.y || m.x - n.x);
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const fromVertical = (Math.atan2(dx, dy) * 180) / Math.PI;
      const fromHorizontal = 90 - Math.abs(fromVertical);

      context.strokeStyle = p.line;
      context.lineWidth = p.strokeWidth;
      context.setLineDash([p.dash, p.dash]);
      context.beginPath();
      context.moveTo(a.x, a.y);
      context.lineTo(b.x, b.y);
      context.stroke();
      context.setLineDash([]);

      const lines = [
        `${round(fromVertical)}° vert · ${round(fromHorizontal)}° horiz`,
        `↔ ${round(dx)} ↕ ${round(dy)}`,
      ];
      const lineHeight = 1.4 * p.fontSize;
      const pad = 0.5 * p.fontSize;
      context.font = `${p.fontSize}px fontra-ui-regular, sans-serif`;
      context.textAlign = "center";
      context.textBaseline = "middle";
      const width = Math.max(...lines.map((s) => context.measureText(s).width)) + 2 * pad;
      const height = lines.length * lineHeight + pad;
      const cx = (a.x + b.x) / 2;
      const cy = -(a.y + b.y) / 2;

      context.scale(1, -1);
      context.fillStyle = p.box;
      context.beginPath();
      context.roundRect(cx - width / 2, cy - height / 2, width, height, pad);
      context.fill();
      context.fillStyle = p.text;
      lines.forEach((s, i) =>
        context.fillText(s, cx, cy + (i - (lines.length - 1) / 2) * lineHeight)
      );
    },
  });
  editor.visualizationLayers.toggle(ID, true);
}
