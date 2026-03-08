import { useState, useMemo } from "react";
import { Search, Plus, ChevronUp, ChevronDown, Sparkles } from "lucide-react";
import { useContacts } from "@/hooks/useContacts";
import { ContactStatus, STATUS_OPTIONS } from "@/lib/types";
import StatusBadge from "@/components/StatusBadge";
import ContactDetailSheet from "@/components/ContactDetailSheet";
import AnimateIn from "@/components/AnimateIn";
import AddContactDialog from "@/components/AddContactDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Contact } from "@/lib/types";

type SortKey = "company" | "followUpDate" | "name";

export default function ContactsPage() {
  const { contacts, add, update, remove, emailSent, followUpSent, replied } = useContacts();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortAsc, setSortAsc] = useState(true);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [page, setPage] = useState(0);
  const perPage = 10;

  const filtered = useMemo(() => {
    let list = contacts;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (c) => c.name.toLowerCase().includes(q) || c.company.toLowerCase().includes(q) || c.email.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== "all") {
      list = list.filter((c) => c.status === statusFilter);
    }
    list = [...list].sort((a, b) => {
      const av = a[sortKey] || "";
      const bv = b[sortKey] || "";
      return sortAsc ? av.localeCompare(bv) : bv.localeCompare(av);
    });
    return list;
  }, [contacts, search, statusFilter, sortKey, sortAsc]);

  const paged = filtered.slice(page * perPage, (page + 1) * perPage);
  const totalPages = Math.ceil(filtered.length / perPage);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const SortIcon = ({ col }: { col: SortKey }) =>
    sortKey === col ? (sortAsc ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />) : null;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-5">
      {/* Header */}
      <AnimateIn>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Contacts</h1>
            <p className="text-sm text-muted-foreground">{filtered.length} contacts</p>
          </div>
          <Button onClick={() => setShowAdd(true)}>
            <Plus className="h-4 w-4 mr-1" /> Add Contact
          </Button>
        </div>
      </AnimateIn>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search name, company, email..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(0); }} className="pl-10 rounded-xl h-10 shadow-soft" />
        </div>
        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(0); }}>
          <SelectTrigger className="w-48 rounded-xl shadow-soft">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {STATUS_OPTIONS.map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="px-4 py-3.5 text-left font-semibold text-muted-foreground text-xs uppercase tracking-wider">#</th>
                <th className="px-4 py-3.5 text-left font-semibold text-muted-foreground text-xs uppercase tracking-wider cursor-pointer" onClick={() => toggleSort("name")}>
                  <span className="flex items-center gap-1">Name <SortIcon col="name" /></span>
                </th>
                <th className="px-4 py-3.5 text-left font-semibold text-muted-foreground text-xs uppercase tracking-wider hidden md:table-cell">Email</th>
                <th className="px-4 py-3.5 text-left font-semibold text-muted-foreground text-xs uppercase tracking-wider hidden lg:table-cell">Title</th>
                <th className="px-4 py-3.5 text-left font-semibold text-muted-foreground text-xs uppercase tracking-wider cursor-pointer" onClick={() => toggleSort("company")}>
                  <span className="flex items-center gap-1">Company <SortIcon col="company" /></span>
                </th>
                <th className="px-4 py-3.5 text-left font-semibold text-muted-foreground text-xs uppercase tracking-wider">Status</th>
                <th className="px-4 py-3.5 text-left font-semibold text-muted-foreground text-xs uppercase tracking-wider hidden lg:table-cell cursor-pointer" onClick={() => toggleSort("followUpDate")}>
                  <span className="flex items-center gap-1">Follow Up <SortIcon col="followUpDate" /></span>
                </th>
                <th className="px-4 py-3.5 text-right font-semibold text-muted-foreground text-xs uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((contact, idx) => (
                <tr key={contact.id} className="border-b border-border last:border-0 hover:bg-accent/50 transition-colors duration-150 animate-row" style={{ animationDelay: `${idx * 40}ms` }}>
                  <td className="px-4 py-3.5 text-muted-foreground">{contact.sno}</td>
                  <td className="px-4 py-3.5 font-medium text-card-foreground cursor-pointer hover:text-primary transition-colors" onClick={() => setSelectedContact(contact)}>{contact.name}</td>
                  <td className="px-4 py-3.5 text-muted-foreground hidden md:table-cell">{contact.email}</td>
                  <td className="px-4 py-3.5 text-muted-foreground hidden lg:table-cell">{contact.title}</td>
                  <td className="px-4 py-3.5 text-card-foreground">{contact.company}</td>
                  <td className="px-4 py-3.5"><StatusBadge status={contact.status} /></td>
                  <td className="px-4 py-3.5 text-muted-foreground hidden lg:table-cell">{contact.followUpDate || "—"}</td>
                  <td className="px-4 py-3.5 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">⋯</Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-xl shadow-elevated">
                        <DropdownMenuItem onClick={() => setSelectedContact(contact)}>View</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => emailSent(contact.id)}>Mark Email Sent</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => followUpSent(contact.id)}>Mark Follow-up Sent</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => replied(contact.id)}>Mark Replied</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => remove(contact.id)}>Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
              {paged.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-16 text-center text-muted-foreground">
                    <div className="flex flex-col items-center gap-2">
                      <Sparkles className="h-8 w-8 text-muted-foreground/30" />
                      <p className="font-medium">No contacts found</p>
                      <p className="text-xs">Try adjusting your search or filter</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3.5 border-t border-border bg-muted/20">
            <p className="text-xs text-muted-foreground font-medium">Page {page + 1} of {totalPages}</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(page - 1)}>Previous</Button>
              <Button variant="outline" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)}>Next</Button>
            </div>
          </div>
        )}
      </div>

      {selectedContact && (
        <ContactDetailSheet
          contact={selectedContact}
          onClose={() => setSelectedContact(null)}
          onUpdate={(updates) => {
            update(selectedContact.id, updates);
            setSelectedContact({ ...selectedContact, ...updates });
          }}
          onEmailSent={() => { emailSent(selectedContact.id); setSelectedContact(null); }}
          onFollowUpSent={() => { followUpSent(selectedContact.id); setSelectedContact(null); }}
          onReplied={() => { replied(selectedContact.id); setSelectedContact(null); }}
        />
      )}

      <AddContactDialog open={showAdd} onClose={() => setShowAdd(false)} onAdd={add} />
    </div>
  );
}