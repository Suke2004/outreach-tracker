import { useState } from "react";
import { FileText, Plus, Copy, Trash2 } from "lucide-react";
import { getTemplates, addTemplate, deleteTemplate } from "@/lib/store";
import { EmailTemplate } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<EmailTemplate[]>(getTemplates);
  const [showAdd, setShowAdd] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<EmailTemplate | null>(null);
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  const handleAdd = () => {
    if (!name || !subject || !body) return;
    addTemplate({ name, subject, body });
    setTemplates(getTemplates());
    setName(""); setSubject(""); setBody("");
    setShowAdd(false);
    toast.success("Template added");
  };

  const handleDelete = (id: string) => {
    deleteTemplate(id);
    setTemplates(getTemplates());
    toast.success("Template deleted");
  };

  const handleCopy = (template: EmailTemplate) => {
    const text = `Subject: ${template.subject}\n\n${template.body}`;
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Email Templates</h1>
        </div>
        <Button onClick={() => setShowAdd(true)}><Plus className="h-4 w-4 mr-1" /> New Template</Button>
      </div>

      <div className="text-xs text-muted-foreground">
        Use variables: <code className="bg-muted px-1 py-0.5 rounded">{"{{NAME}}"}</code> <code className="bg-muted px-1 py-0.5 rounded">{"{{COMPANY}}"}</code> <code className="bg-muted px-1 py-0.5 rounded">{"{{TITLE}}"}</code>
      </div>

      <div className="grid gap-4">
        {templates.map((t) => (
          <div key={t.id} className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-card-foreground">{t.name}</h3>
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" onClick={() => handleCopy(t)}><Copy className="h-3.5 w-3.5" /></Button>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(t.id)}><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-1">Subject: {t.subject}</p>
            <p className="text-xs text-muted-foreground line-clamp-3 whitespace-pre-wrap">{t.body}</p>
            <Button variant="link" size="sm" className="p-0 mt-2 text-primary" onClick={() => setPreviewTemplate(t)}>Preview</Button>
          </div>
        ))}
      </div>

      {/* Add Template Dialog */}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent>
          <DialogHeader><DialogTitle>New Template</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Template Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
            <div><Label>Subject</Label><Input value={subject} onChange={(e) => setSubject(e.target.value)} /></div>
            <div><Label>Body</Label><Textarea value={body} onChange={(e) => setBody(e.target.value)} rows={8} /></div>
            <Button onClick={handleAdd} className="w-full">Save Template</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={!!previewTemplate} onOpenChange={() => setPreviewTemplate(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{previewTemplate?.name}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <p className="text-sm font-medium text-card-foreground">Subject: {previewTemplate?.subject}</p>
            <div className="whitespace-pre-wrap text-sm text-card-foreground bg-muted p-4 rounded-lg">{previewTemplate?.body}</div>
            <Button onClick={() => previewTemplate && handleCopy(previewTemplate)} className="w-full">
              <Copy className="h-4 w-4 mr-1" /> Copy to Clipboard
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
