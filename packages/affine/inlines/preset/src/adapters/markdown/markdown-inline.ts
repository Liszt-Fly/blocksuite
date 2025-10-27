import { MarkdownASTToDeltaExtension } from '@blocksuite/affine-shared/adapters';

function parseHighlightSegments(text: string) {
  const segments: Array<{ text: string; color?: string; background?: string }> = []
  const re = /==\((!?)([^)]+)\)(.+?)==|==(.+?)==/g
  let lastIndex = 0
  let m: RegExpExecArray | null
  while ((m = re.exec(text))) {
    const start = m.index
    if (start > lastIndex) {
      segments.push({ text: text.slice(lastIndex, start) })
    }
    if (m[4] !== undefined) {
      // ==text== default bg
      segments.push({ text: m[4], background: '#f1c40f' })
    } else {
      const bang = m[1]
      const color = (m[2] || '').trim()
      const body = m[3] || ''
      if (bang === '!') {
        segments.push({ text: body, background: color })
      } else {
        segments.push({ text: body, color })
      }
    }
    lastIndex = re.lastIndex
  }
  if (lastIndex < text.length) {
    segments.push({ text: text.slice(lastIndex) })
  }
  return segments
}

export const markdownTextToDeltaMatcher = MarkdownASTToDeltaExtension({
  name: 'text',
  match: ast => ast.type === 'text' && !('value' in ast && /==\((!?.+?)\).+?==|==.+?==/.test((ast as any).value as string)),
  toDelta: ast => {
    if (!('value' in ast)) {
      return [];
    }
    return [{ insert: ast.value }];
  },
});

export const markdownHighlightToDeltaMatcher = MarkdownASTToDeltaExtension({
  name: 'highlight',
  match: ast => ast.type === 'text' && 'value' in ast && (/==\((!?.+?)\).+?==|==.+?==/.test((ast as any).value as string)),
  toDelta: ast => {
    if (!('value' in ast)) return []
    const value = (ast as any).value as string
    const parts = parseHighlightSegments(value)
    return parts.map(p => {
      const d: any = { insert: p.text }
      if (p.background || p.color) {
        d.attributes = { ...(p.background ? { background: p.background } : {}), ...(p.color ? { color: p.color } : {}) }
      }
      return d
    })
  },
})

export const markdownInlineCodeToDeltaMatcher = MarkdownASTToDeltaExtension({
  name: 'inlineCode',
  match: ast => ast.type === 'inlineCode',
  toDelta: ast => {
    if (!('value' in ast)) {
      return [];
    }
    return [{ insert: ast.value, attributes: { code: true } }];
  },
});

export const markdownStrongToDeltaMatcher = MarkdownASTToDeltaExtension({
  name: 'strong',
  match: ast => ast.type === 'strong',
  toDelta: (ast, context) => {
    if (!('children' in ast)) {
      return [];
    }
    return ast.children.flatMap(child =>
      context.toDelta(child).map(delta => {
        delta.attributes = { ...delta.attributes, bold: true };
        return delta;
      })
    );
  },
});

export const markdownEmphasisToDeltaMatcher = MarkdownASTToDeltaExtension({
  name: 'emphasis',
  match: ast => ast.type === 'emphasis',
  toDelta: (ast, context) => {
    if (!('children' in ast)) {
      return [];
    }
    return ast.children.flatMap(child =>
      context.toDelta(child).map(delta => {
        delta.attributes = { ...delta.attributes, italic: true };
        return delta;
      })
    );
  },
});

export const markdownDeleteToDeltaMatcher = MarkdownASTToDeltaExtension({
  name: 'delete',
  match: ast => ast.type === 'delete',
  toDelta: (ast, context) => {
    if (!('children' in ast)) {
      return [];
    }
    return ast.children.flatMap(child =>
      context.toDelta(child).map(delta => {
        delta.attributes = { ...delta.attributes, strike: true };
        return delta;
      })
    );
  },
});

export const markdownListToDeltaMatcher = MarkdownASTToDeltaExtension({
  name: 'list',
  match: ast => ast.type === 'list',
  toDelta: () => [],
});

export const markdownHtmlToDeltaMatcher = MarkdownASTToDeltaExtension({
  name: 'html',
  match: ast => ast.type === 'html',
  toDelta: ast => {
    if (!('value' in ast)) {
      return [];
    }
    return [{ insert: ast.value }];
  },
});

export const MarkdownInlineToDeltaAdapterExtensions = [
  markdownHighlightToDeltaMatcher,
  markdownTextToDeltaMatcher,
  markdownInlineCodeToDeltaMatcher,
  markdownStrongToDeltaMatcher,
  markdownEmphasisToDeltaMatcher,
  markdownDeleteToDeltaMatcher,
  markdownListToDeltaMatcher,
  markdownHtmlToDeltaMatcher,
];
