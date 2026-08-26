import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import './CopyButton.css';

export function CopyButton({ text, onCopy, label = 'Copy', copiedLabel = 'Copied', variant = 'secondary', size = 'sm' }) {
  const [copied, setCopied] = useState(false);

  const handleClick = async (e) => {
    e.stopPropagation();
    if (!text && text !== '') return;

    if (onCopy) {
      onCopy(text, `${label} copied!`);
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
    }

    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <button
      type="button"
      className={`copy-btn copy-btn-${variant} copy-btn-${size} ${copied ? 'copy-btn-copied' : ''}`}
      onClick={handleClick}
      title={copied ? copiedLabel : label}
      aria-label={label}
    >
      {copied ? <Check size={12} className="copy-icon-check" /> : <Copy size={12} />}
      {variant !== 'icon' && <span>{copied ? copiedLabel : label}</span>}
    </button>
  );
}
