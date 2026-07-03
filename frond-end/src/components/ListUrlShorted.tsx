import React, { useState } from "react";
import { useToast } from "#/components/ui/8bit/toast";

import { Card, CardHeader, CardContent } from "#/components/ui/8bit/card";
import { Button } from "#/components/ui/8bit/button";

type UrlItem = {
  id: string;
  shorter_url: string;
  original_url: string;
};

interface ListUrlShortedProps {
  items?: UrlItem[];
  onDelete?: (id: string) => void;
}

const ListUrlShorted: React.FC<ListUrlShortedProps> = ({ items = [], onDelete }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [hidden, setHidden] = useState(true);
  const backendUrl = (import.meta as any).env?.VITE_BACKEND_URL || (import.meta as any).env?.BACKEND_URL || 'http://localhost:3030'

  const { toast } = useToast()

  const handleCopy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1500);
      toast('Copied!!')
    } catch (err) {
      // fail quietly for now
      // optionally: show a toast or console
      console.error("copy failed", err);
    }
  };

  const handleDelete = (id: string) => {
    onDelete?.(id);
  };

  return (
    <Card className={hidden ? "w-full fixed bottom-4 left-1/2 z-50 max-w-3xl -translate-x-1/2 mx-auto" : "w-full"}>
      <CardHeader className="px-3 py-2 flex items-center justify-between gap-3">
        <h3 className="text-sm">Shorted URLs</h3>
        <Button size="sm" variant="secondary" onClick={() => setHidden((prev) => !prev)}>
          {hidden ? 'Show' : 'Hide'}
        </Button>
      </CardHeader>

      {!hidden ? (
        <CardContent className="p-0">
          <div className="w-full">
            <div className="grid grid-cols-12 gap-2 items-center px-3 py-2 border-b">
              <div className="col-span-1 text-xs font-medium">No</div>
              <div className="col-span-4 text-xs font-medium">Shorted URL</div>
              <div className="col-span-1 text-xs font-medium text-center">Copy</div>
              <div className="col-span-5 text-xs font-medium">Original URL</div>
              <div className="col-span-1" />
            </div>

            <div className="overflow-auto" style={{ height: 300 }}>
              {items.length === 0 ? (
                <div className="p-4 text-center text-sm">No shortened URLs yet.</div>
              ) : (
                items.map((it, idx) => (
                  <div
                    key={it.id}
                    className="grid grid-cols-12 gap-2 items-center px-3 py-2 odd:bg-card-foreground/5 hover:bg-card-foreground/10"
                  >
                    <div className="col-span-1 text-xs">{idx + 1}</div>

                    <div className="col-span-4 pr-3">
                      <a href={`${backendUrl}/${it.shorter_url}`} target="_blank" rel="noreferrer" className="underline text-xs block truncate max-w-full">
                        {`${backendUrl}/${it.shorter_url}`}
                      </a>
                    </div>

                    <div className="col-span-1 flex justify-center">
                      <Button
                        size="icon"
                        variant="secondary"
                        className="w-6 h-6 p-1"
                        onClick={() => handleCopy(`${backendUrl}/${it.shorter_url}`, it.id)}
                        aria-label="Copy"
                        title={copiedId === it.id ? "Copied" : "Copy"}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-block">
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                        </svg>
                      </Button>
                    </div>

                    <div className="col-span-5 truncate text-xs text-center" title={it.original_url}>
                      {it.original_url}
                    </div>

                    {/* <div className="col-span-1 flex justify-end">
                      <Button size="icon" variant="destructive" className="p-1" onClick={() => handleDelete(it.id)} aria-label="Delete">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-block">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                          <path d="M10 11v6M14 11v6" />
                          <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
                        </svg>
                      </Button>
                    </div> */}
                  </div>
                ))
              )}
            </div>
          </div>
        </CardContent>
      ) : null}
    </Card>
  );
};

export default ListUrlShorted;