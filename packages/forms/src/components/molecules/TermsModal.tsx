import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import DOMPurify from 'dompurify';
import parse, { DOMNode, domToReact } from 'html-react-parser';

export interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
  title: string;
  content: string;
}

export const TermsModal = ({ isOpen, onClose, onAccept, title, content }: TermsModalProps) => {
  const sanitizedContent = DOMPurify.sanitize(content);

  const renderChildren = (children: unknown[] | string | undefined) => {
    if (Array.isArray(children)) return domToReact(children as DOMNode[]);
    return (children as string) ?? null;
  };

  // Parse sanitized HTML into React elements and map tags to styled React elements
  const parsed = parse(sanitizedContent, {
    replace: (domNode: DOMNode) => {
      // Only handle element nodes
      const node = domNode as unknown as {
        type?: string;
        name?: string;
        tagName?: string;
        attribs?: Record<string, string>;
        children?: unknown[] | string;
      };
      if (!node || !node.type || node.type !== 'tag') return undefined;

      const tagName = (node && node.name) || node.tagName;

      // Map common tags to React elements with Tailwind classes to ensure styling
      switch (tagName) {
        case 'h1':
        case 'h2':
          return (
            <h2 className="text-lg font-semibold mt-4 mb-2">{renderChildren(node.children)}</h2>
          );
        case 'h3':
          return (
            <h3 className="text-md font-semibold mt-3 mb-2">{renderChildren(node.children)}</h3>
          );
        case 'p':
          return <p className="my-2 text-base leading-relaxed">{renderChildren(node.children)}</p>;
        case 'ul':
          return <ul className="list-disc ml-6 my-2">{renderChildren(node.children)}</ul>;
        case 'ol':
          return <ol className="list-decimal ml-6 my-2">{renderChildren(node.children)}</ol>;
        case 'li':
          return <li className="my-1">{renderChildren(node.children)}</li>;
        case 'strong':
        case 'b':
          return <strong className="font-semibold">{renderChildren(node.children)}</strong>;
        case 'em':
        case 'i':
          return <em className="italic">{renderChildren(node.children)}</em>;
        case 'br':
          return <br />;
        case 'a': {
          // preserve href if present but ensure rel/noreferrer in outer usage
          const href = node.attribs && node.attribs.href;
          return (
            <a
              href={href}
              className="text-primary underline"
              target={href ? '_blank' : undefined}
              rel={href ? 'noopener noreferrer' : undefined}
            >
              {renderChildren(node.children)}
            </a>
          );
        }
        default:
          return undefined;
      }
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[90vw] max-w-5xl h-[60vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl">{title}</DialogTitle>
          <DialogDescription>
            Por favor, lee cuidadosamente los términos y condiciones antes de continuar.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto pr-4 -mx-6 px-6">
          <div>{parsed}</div>
        </div>
        <DialogFooter>
          <Button onClick={onAccept}>Aceptar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
