'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Calendar } from '@/components/ui/calendar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { DateRange } from 'react-day-picker';
import { addDays, format, startOfMonth, endOfMonth, startOfWeek, endOfWeek } from 'date-fns';
import { is } from 'date-fns/locale';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Download, FileText, FileSpreadsheet, Loader2, Printer, Plus, Save, DollarSign, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';
import { generateExportData, type ExportData } from '@/lib/export-actions';
import { getClients, createClient, type CreateClientInput } from '@/lib/client-actions';
import { sendInvoiceEmail } from '@/lib/email-actions';
import { toast } from 'sonner';

type Project = {
  id: number;
  name: string;
};

type ExportFormProps = {
  projects: Project[];
};

export function ExportForm({ projects }: ExportFormProps) {
  const t = useTranslations('Export');
  const [date, setDate] = useState<DateRange | undefined>({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date()),
  });
  const [selectedProject, setSelectedProject] = useState<string>('all');
  const [exportType, setExportType] = useState<'pdf' | 'invoice' | 'csv'>('pdf');
  const [includeExpenses, setIncludeExpenses] = useState(true);
  const [includeTimeLogs, setIncludeTimeLogs] = useState(true);
  const [grouping, setGrouping] = useState<'project' | 'date' | 'user'>('project');
  const [invoiceDetails, setInvoiceDetails] = useState({
    clientName: '',
    clientAddress: '',
    clientCity: '',
    invoiceNumber: '',
    vatRate: 24,
    dueDate: addDays(new Date(), 30),
    issueDate: new Date(),
    notes: '',
    vatNumber: '',
    clientEmail: '',
    bankAccount: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [clients, setClients] = useState<any[]>([]);
  const [selectedClient, setSelectedClient] = useState<string>('');
  const [isCreatingClient, setIsCreatingClient] = useState(false);

  const [data, setData] = useState<ExportData | null>(null);

  // Email state
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailRecipient, setEmailRecipient] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailMessage, setEmailMessage] = useState('');

  useEffect(() => {
    const fetchClients = async () => {
        const fetchedClients = await getClients();
        setClients(fetchedClients);
    };
    fetchClients();
  }, []);

  const handleClientSelect = (clientId: string) => {
    if (clientId === 'new') {
        setSelectedClient('');
        setInvoiceDetails(prev => ({
            ...prev,
            clientName: '',
            clientAddress: '',
            clientCity: '',
            vatNumber: '',
            clientEmail: '',
            bankAccount: ''
        }));
        setEmailRecipient('');
        return;
    }
    
    setSelectedClient(clientId);
    const client = clients.find(c => c.id.toString() === clientId);
    if (client) {
        setInvoiceDetails(prev => ({
            ...prev,
            clientName: client.name,
            clientAddress: client.address || '',
            clientCity: client.city || '',
            vatNumber: client.vatNumber || '',
            clientEmail: client.email || '',
            bankAccount: client.bankAccount || ''
        }));
        setEmailRecipient(client.email || '');
    }
  };

  const handleSaveClient = async () => {
    if (!invoiceDetails.clientName) {
        toast.error(t('invoiceDetails.clientNameRequired'));
        return;
    }

    setIsCreatingClient(true);
    const result = await createClient({
        name: invoiceDetails.clientName,
        address: invoiceDetails.clientAddress,
        city: invoiceDetails.clientCity,
        email: invoiceDetails.clientEmail,
        contactPerson: '', // Optional
        vatNumber: invoiceDetails.vatNumber, // Optional
        bankAccount: invoiceDetails.bankAccount, // Optional
    });

    if (result.error) {
        toast.error(t('invoiceDetails.saveClientError'));
        if (result.details) {
            // Show specific validation errors if available
            Object.values(result.details.fieldErrors).forEach(errors => {
                if (errors) errors.forEach(e => toast.error(e));
            });
        }
    } else if (result.success && result.client) {
        toast.success(t('invoiceDetails.saveClientSuccess'));
        setClients(prev => [...prev, result.client]);
        setSelectedClient(result.client.id.toString());
    }
    setIsCreatingClient(false);
  };


  const handleQuickSelect = (type: 'week' | 'month' | 'year') => {
    const now = new Date();
    if (type === 'week') {
      setDate({ from: startOfWeek(now, { weekStartsOn: 1 }), to: endOfWeek(now, { weekStartsOn: 1 }) });
    } else if (type === 'month') {
      setDate({ from: startOfMonth(now), to: endOfMonth(now) });
    } else if (type === 'year') {
      setDate({ from: new Date(now.getFullYear(), 0, 1), to: new Date(now.getFullYear(), 11, 31) });
    }
  };

  const fetchData = async () => {
    if (!date?.from || !date?.to) return;

    setIsLoading(true);
    const result = await generateExportData({
      from: date.from,
      to: date.to,
      projectId: selectedProject,
    });

    if (result.error) {
      toast.error(result.error);
    } else if (result.data) {
      setData(result.data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [date, selectedProject]);

  const handleExport = async () => {
    if (!data) {
      await fetchData();
    }
    
    if (exportType === 'csv') {
       downloadCSV();
    } else {
       // For PDF and Invoice, we trigger the print dialog which the user can save as PDF
       setTimeout(() => {
         window.print();
       }, 100);
    }
  };

  const handleOpenEmailDialog = () => {
    if (!data) {
        fetchData();
    }
    setEmailSubject(`${t('invoice')} #${invoiceDetails.invoiceNumber || 'DRAFT'} - ${invoiceDetails.clientName}`);
    setEmailMessage(`Please find attached the invoice for the period ${format(date?.from || new Date(), 'MMM d')} - ${format(date?.to || new Date(), 'MMM d, yyyy')}.`);
    setIsEmailDialogOpen(true);
  };

  const handleSendEmail = async () => {
    if (!emailRecipient) {
        toast.error("Email recipient is required");
        return;
    }
    if (!data) {
        toast.error("No data to send");
        return;
    }

    setIsSendingEmail(true);
    
    const result = await sendInvoiceEmail({
        email: emailRecipient,
        subject: emailSubject,
        message: emailMessage,
        data,
        invoiceDetails: {
            ...invoiceDetails,
            // Ensure all required fields are present for email template
            vatNumber: invoiceDetails.vatNumber || ''
        },
    });

    if (result.error) {
        toast.error("Failed to send email");
    } else {
        toast.success("Email sent successfully");
        setIsEmailDialogOpen(false);
    }
    setIsSendingEmail(false);
  };

  const downloadCSV = () => {
    if (!data) return;

    let csvContent = "data:text/csv;charset=utf-8,";
    
    if (includeTimeLogs) {
      csvContent += "Time Entries\n";
      csvContent += "Date,Project,Description,Duration (Hours),User\n";
      data.entries.forEach(e => {
        const hours = (e.duration || 0) / 3600;
        csvContent += `${format(new Date(e.date), 'yyyy-MM-dd')},"${e.projectName}","${e.description || ''}",${hours.toFixed(2)},"${e.userName || ''}"\n`;
      });
      csvContent += "\n";
    }

    if (includeExpenses) {
      csvContent += "Expenses\n";
      csvContent += "Date,Project,Description,Amount,User\n";
      data.expenses.forEach(e => {
        csvContent += `${format(new Date(e.date), 'yyyy-MM-dd')},"${e.projectName}","${e.description}",${e.amount},"${e.userName || ''}"\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `export_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('is-IS', { style: 'currency', currency: 'ISK' }).format(amount);
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 print:block print:w-full">
      <Card className="print:hidden">
        <CardHeader>
          <CardTitle>{t('configuration')}</CardTitle>
          <CardDescription>{t('configurationDesc')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Date Selection */}
          <div className="space-y-2">
            <Label>{t('dateRange')}</Label>
            <div className="flex gap-2 mb-2">
              <Button variant="outline" size="sm" className="bg-transparent" onClick={() => handleQuickSelect('week')}>{t('thisWeek')}</Button>
              <Button variant="outline" size="sm" className="bg-transparent" onClick={() => handleQuickSelect('month')}>{t('thisMonth')}</Button>
              <Button variant="outline" size="sm" className="bg-transparent" onClick={() => handleQuickSelect('year')}>{t('thisYear')}</Button>
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={'outline'}
                  className={cn(
                    'w-full justify-start text-left font-normal bg-transparent',
                    !date && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, 'LLL dd, y', { locale: is })} -{' '}
                        {format(date.to, 'LLL dd, y', { locale: is })}
                      </>
                    ) : (
                      format(date.from, 'LLL dd, y', { locale: is })
                    )
                  ) : (
                    <span>{t('pickDate')}</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={setDate}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Project Selection */}
          <div className="space-y-2">
            <Label>{t('project')}</Label>
            <Select value={selectedProject} onValueChange={setSelectedProject}>
              <SelectTrigger className="bg-transparent">
                <SelectValue placeholder={t('selectProject')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('allProjects')}</SelectItem>
                {projects.map((p) => (
                  <SelectItem key={p.id} value={p.id.toString()}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

           {/* Export Type */}
           <div className="space-y-2">
            <Label>{t('exportType')}</Label>
            <div className="grid grid-cols-3 gap-4">
                <div 
                    className={cn(
                        "flex flex-col items-center gap-2 p-4 rounded-lg border-2 cursor-pointer hover:bg-accent transition-colors",
                        exportType === 'pdf' ? "border-primary bg-accent" : "border-transparent bg-transparent hover:bg-muted/50"
                    )}
                    onClick={() => setExportType('pdf')}
                >
                    <FileText className="h-6 w-6" />
                    <span className="text-xs font-medium">{t('pdfReport')}</span>
                </div>
                <div 
                    className={cn(
                        "flex flex-col items-center gap-2 p-4 rounded-lg border-2 cursor-pointer hover:bg-accent transition-colors",
                        exportType === 'invoice' ? "border-primary bg-accent" : "border-transparent bg-transparent hover:bg-muted/50"
                    )}
                    onClick={() => setExportType('invoice')}
                >
                    <DollarSign className="h-6 w-6" />
                    <span className="text-xs font-medium">{t('invoice')}</span>
                </div>
                <div 
                     className={cn(
                        "flex flex-col items-center gap-2 p-4 rounded-lg border-2 cursor-pointer hover:bg-accent transition-colors",
                        exportType === 'csv' ? "border-primary bg-accent" : "border-transparent bg-transparent hover:bg-muted/50"
                    )}
                    onClick={() => setExportType('csv')}
                >
                    <FileSpreadsheet className="h-6 w-6" />
                    <span className="text-xs font-medium">{t('csvExcel')}</span>
                </div>
            </div>
          </div>

          {/* Invoice Details Inputs */}
          {exportType === 'invoice' && (
            <div className="space-y-4 border-t pt-4 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-muted-foreground">{t('invoiceDetails.title')}</h3>
                    {!selectedClient && (
                         <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={handleSaveClient}
                            disabled={isCreatingClient || !invoiceDetails.clientName}
                            className={cn("h-8 text-xs", (!invoiceDetails.clientName) && "opacity-50 cursor-not-allowed")}
                        >
                            {isCreatingClient ? <Loader2 className="mr-2 h-3 w-3 animate-spin" /> : <Save className="mr-2 h-3 w-3" />}
                            {t('invoiceDetails.saveClient')}
                        </Button>
                    )}
                </div>
                
                <div className="grid gap-4">
                    <div className="space-y-2">
                        <Label>{t('invoiceDetails.selectClient')}</Label>
                        <Select value={selectedClient} onValueChange={handleClientSelect}>
                            <SelectTrigger className="bg-transparent relative z-20">
                                <SelectValue placeholder={t('invoiceDetails.selectClientPlaceholder')} />
                            </SelectTrigger>
                            <SelectContent className="z-50">
                                <SelectItem value="new">
                                    <span className="flex items-center text-muted-foreground">
                                        <Plus className="mr-2 h-4 w-4" />
                                        {t('invoiceDetails.createNewClient')}
                                    </span>
                                </SelectItem>
                                {clients.map((client) => (
                                    <SelectItem key={client.id} value={client.id.toString()}>
                                        {client.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    
                    <div className="grid gap-2">
                        <Label>{t('invoiceDetails.clientName')}</Label>
                        <Input 
                            value={invoiceDetails.clientName}
                            onChange={(e) => setInvoiceDetails(prev => ({ ...prev, clientName: e.target.value }))}
                            placeholder={t('invoiceDetails.clientNamePlaceholder')}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label>Netfang</Label>
                        <Input 
                            value={invoiceDetails.clientEmail}
                            onChange={(e) => setInvoiceDetails(prev => ({ ...prev, clientEmail: e.target.value }))}
                            placeholder="client@example.com"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label>{t('invoiceDetails.clientAddress')}</Label>
                        <Input 
                            value={invoiceDetails.clientAddress}
                            onChange={(e) => setInvoiceDetails(prev => ({ ...prev, clientAddress: e.target.value }))}
                            placeholder={t('invoiceDetails.addressPlaceholder')}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label>{t('invoiceDetails.clientCity')}</Label>
                        <Input 
                            value={invoiceDetails.clientCity}
                            onChange={(e) => setInvoiceDetails(prev => ({ ...prev, clientCity: e.target.value }))}
                            placeholder={t('invoiceDetails.cityPlaceholder')}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label>{t('invoiceDetails.invoiceNumber')}</Label>
                            <Input 
                                value={invoiceDetails.invoiceNumber}
                                onChange={(e) => setInvoiceDetails(prev => ({ ...prev, invoiceNumber: e.target.value }))}
                                placeholder="2024-001"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label>{t('invoiceDetails.vatRate')}</Label>
                            <Input 
                                type="number"
                                value={invoiceDetails.vatRate}
                                onChange={(e) => setInvoiceDetails(prev => ({ ...prev, vatRate: parseFloat(e.target.value) || 0 }))}
                            />
                        </div>
                    </div>
                     <div className="grid gap-2">
                        <Label>Kennitala</Label>
                        <Input 
                            value={invoiceDetails.vatNumber}
                            onChange={(e) => setInvoiceDetails(prev => ({ ...prev, vatNumber: e.target.value.replace(/[^0-9]/g, '').slice(0, 10) }))}
                            placeholder="0000000000"
                            maxLength={10}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label>Reikningsnúmer (Banki-HB-Reikningur)</Label>
                        <Input 
                            value={invoiceDetails.bankAccount}
                            onChange={(e) => {
                                // Basic formatting helper or just raw input for now
                                setInvoiceDetails(prev => ({ ...prev, bankAccount: e.target.value }))
                            }}
                            placeholder="2401-26-240100"
                        />
                    </div>
                     <div className="grid gap-2">
                        <Label>{t('invoiceDetails.notes')}</Label>
                        <Textarea 
                            value={invoiceDetails.notes}
                            onChange={(e) => setInvoiceDetails(prev => ({ ...prev, notes: e.target.value }))}
                            placeholder={t('invoiceDetails.notesPlaceholder')}
                        />
                    </div>
                </div>
            </div>
          )}

          <div className="flex items-center space-x-2">
            <Checkbox 
                id="expenses" 
                checked={includeExpenses}
                onCheckedChange={(c) => setIncludeExpenses(!!c)}
            />
            <Label htmlFor="expenses">{t('includeExpenses')}</Label>
          </div>
          
           <div className="flex items-center space-x-2">
            <Checkbox 
                id="timeLogs" 
                checked={includeTimeLogs}
                onCheckedChange={(c) => setIncludeTimeLogs(!!c)}
            />
            <Label htmlFor="timeLogs">{t('includeTimeLogs')}</Label>
          </div>

          <div className="flex gap-2">
            <Button className="flex-1" onClick={handleExport} disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
                {t('exportButton')}
            </Button>
            <Dialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
                <DialogTrigger asChild>
                    <Button variant="outline" onClick={handleOpenEmailDialog}>
                        <Mail className="mr-2 h-4 w-4" />
                        Email
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Send Invoice via Email</DialogTitle>
                        <DialogDescription>
                            Enter the recipient email address and a custom message.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Recipient Email</Label>
                            <Input
                                id="email"
                                value={emailRecipient}
                                onChange={(e) => setEmailRecipient(e.target.value)}
                                placeholder="client@example.com"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="subject">Subject</Label>
                            <Input
                                id="subject"
                                value={emailSubject}
                                onChange={(e) => setEmailSubject(e.target.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="message">Message</Label>
                            <Textarea
                                id="message"
                                value={emailMessage}
                                onChange={(e) => setEmailMessage(e.target.value)}
                                rows={4}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={handleSendEmail} disabled={isSendingEmail}>
                            {isSendingEmail ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Mail className="mr-2 h-4 w-4" />}
                            Send Email
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
      
      {/* Preview Section */}
       <div className="hidden md:block print:hidden">
         <Card className="h-full overflow-hidden flex flex-col bg-background border-border">
            <CardHeader>
                <CardTitle>{t('preview')}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-6 min-h-[600px] bg-background text-foreground print:bg-white print:text-black">
               {!data ? (
                <div className="flex h-full items-center justify-center rounded-md border border-dashed text-muted-foreground">
                    {t('previewPlaceholder')}
                </div>
               ) : (
                 <div className="space-y-8 text-sm">
                   {/* Header */}
                   <div className="flex justify-between items-start">
                     <div>
                       <h1 className="text-2xl font-bold mb-2">{exportType === 'invoice' ? t('invoice') : t('report')}</h1>
                       <p className="text-muted-foreground">
                         {t('exportedOn')}: {format(new Date(), 'PPP', { locale: is })}
                       </p>
                     </div>
                     {exportType === 'invoice' && (
                        <div className="text-right">
                            <p className="font-bold text-lg">#{invoiceDetails.invoiceNumber}</p>
                            <p className="text-muted-foreground">{t('invoiceDetails.dueDate')}: {format(invoiceDetails.dueDate, 'PPP', { locale: is })}</p>
                        </div>
                     )}
                   </div>

                   {/* Invoice Details */}
                   {exportType === 'invoice' && (
                    <div className="flex justify-between gap-8 p-6 bg-muted/50 rounded-lg print:bg-gray-50 print:text-black">
                        <div>
                            <h3 className="font-bold mb-2 text-muted-foreground uppercase text-xs">{t('billTo')}</h3>
                            <p className="font-bold text-lg">{invoiceDetails.clientName || '—'}</p>
                            {invoiceDetails.clientEmail && <p>{invoiceDetails.clientEmail}</p>}
                            <p>{invoiceDetails.clientAddress}</p>
                            <p>{invoiceDetails.clientCity}</p>
                            {invoiceDetails.vatNumber && <p>Kt: {invoiceDetails.vatNumber}</p>}
                            {invoiceDetails.bankAccount && <p>Rn: {invoiceDetails.bankAccount}</p>}
                        </div>
                        <div className="text-right">
                             <h3 className="font-bold mb-2 text-muted-foreground uppercase text-xs">Útgefandi</h3>
                             <p className="font-bold">Tímagátt Notandi</p>
                        </div>
                    </div>
                   )}

                   {/* Entries Table */}
                   {includeTimeLogs && data.entries.length > 0 && (
                     <div>
                        <h3 className="font-bold mb-4 border-b pb-2">{t('sections.timeEntries')}</h3>
                        <table className="w-full">
                            <thead>
                                <tr className="text-left text-xs uppercase text-muted-foreground">
                                    <th className="pb-2">{t('table.date')}</th>
                                    <th className="pb-2">{t('table.project')}</th>
                                    <th className="pb-2">{t('table.description')}</th>
                                    <th className="pb-2 text-right">{t('table.hours')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y border-b">
                                {data.entries.map((entry) => (
                                    <tr key={entry.id}>
                                        <td className="py-2">{format(new Date(entry.date), 'd. MMM')}</td>
                                        <td className="py-2">{entry.projectName}</td>
                                        <td className="py-2">{entry.description}</td>
                                        <td className="py-2 text-right font-mono">
                                            {((entry.duration || 0) / 3600).toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr className="font-bold border-t">
                                    <td colSpan={3} className="pt-4 text-right">{t('totalHours')}</td>
                                    <td className="pt-4 text-right font-mono">
                                        {(data.summary.totalDuration / 3600).toFixed(2)}
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                     </div>
                   )}

                   {/* Expenses Table */}
                   {includeExpenses && data.expenses.length > 0 && (
                     <div>
                        <h3 className="font-bold mb-4 border-b pb-2">{t('sections.expenses')}</h3>
                        <table className="w-full">
                            <thead>
                                <tr className="text-left text-xs uppercase text-muted-foreground">
                                    <th className="pb-2">{t('table.date')}</th>
                                    <th className="pb-2">{t('table.project')}</th>
                                    <th className="pb-2">{t('table.description')}</th>
                                    <th className="pb-2 text-right">{t('table.amount')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y border-b">
                                {data.expenses.map((expense) => (
                                    <tr key={expense.id}>
                                        <td className="py-2">{format(new Date(expense.date), 'd. MMM')}</td>
                                        <td className="py-2">{expense.projectName}</td>
                                        <td className="py-2">{expense.description}</td>
                                        <td className="py-2 text-right font-mono">
                                            {formatCurrency(Number(expense.amount))}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr className="font-bold border-t">
                                    <td colSpan={3} className="pt-4 text-right">{t('expensesTotal')}</td>
                                    <td className="pt-4 text-right font-mono">
                                        {formatCurrency(data.summary.totalAmount)}
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                     </div>
                   )}

                   {/* Totals */}
                   {exportType === 'invoice' && (
                       <div className="border-t pt-4 flex justify-end">
                           <div className="w-64 space-y-2">
                               <div className="flex justify-between">
                                   <span>Samtals án VSK:</span>
                                   <span className="font-mono">
                                       {formatCurrency(
                                            // Assuming 20,000 ISK/hr rate for demo
                                            (data.summary.totalDuration / 3600) * 20000 + data.summary.totalAmount
                                       )}
                                   </span>
                               </div>
                               <div className="flex justify-between text-muted-foreground">
                                   <span>VSK ({invoiceDetails.vatRate}%):</span>
                                   <span className="font-mono">
                                       {formatCurrency(
                                            ((data.summary.totalDuration / 3600) * 20000 + data.summary.totalAmount) * (invoiceDetails.vatRate / 100)
                                       )}
                                   </span>
                               </div>
                               <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
                                   <span>{t('totalDue')}</span>
                                   <span className="font-mono">
                                        {formatCurrency(
                                            ((data.summary.totalDuration / 3600) * 20000 + data.summary.totalAmount) * (1 + invoiceDetails.vatRate / 100)
                                        )}
                                   </span>
                               </div>
                           </div>
                       </div>
                   )}
                   
                   {invoiceDetails.notes && (
                       <div className="border-t pt-6 mt-8">
                           <h4 className="font-bold text-sm mb-2">Skilmálar / Athugasemdir</h4>
                           <p className="text-muted-foreground whitespace-pre-wrap">{invoiceDetails.notes}</p>
                       </div>
                   )}
                 </div>
               )}
            </CardContent>
         </Card>
       </div>
    </div>
  );
}