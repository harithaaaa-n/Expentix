import React, { useState, useEffect } from 'react';
import { useForm, type FieldValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Loader2, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ExpenseCategories, PaymentTypes, ExpenseSchema } from '@/types/expense';
import { IncomeSources, IncomeSchema } from '@/types/income';
import { FamilyMember } from '@/types/settings';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@/integrations/supabase/session-context';
import { showError, showSuccess } from '@/utils/toast';

// Unified Schema for form validation
const TransactionSchema = z.object({
  type: z.enum(['expense', 'income']),
  member_id: z.string().min(1, "Member is required"),
  amount: z.number().min(0.01, "Amount must be greater than zero"),
  date: z.date(),
  description: z.string().max(255).optional().nullable(),
  
  // Expense specific fields
  title: z.string().optional(),
  category: z.enum(ExpenseCategories).optional(),
  payment_type: z.enum(PaymentTypes).optional().nullable(),
  
  // Income specific fields
  source: z.enum(IncomeSources).optional(),
}).superRefine((data, ctx) => {
  if (data.type === 'expense') {
    if (!data.title || data.title.length < 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Title is required for expense",
        path: ['title'],
      });
    }
    if (!data.category) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Category is required for expense",
        path: ['category'],
      });
    }
  } else if (data.type === 'income') {
    if (!data.source) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Source is required for income",
        path: ['source'],
      });
    }
  }
});

type TransactionFormValues = z.infer<typeof TransactionSchema>;

interface MemberTransactionFormProps {
  members: FamilyMember[];
  ownerName: string;
  ownerId: string;
  onSuccess: () => void;
  initialMemberId?: string;
}

const MemberTransactionForm: React.FC<MemberTransactionFormProps> = ({ members, ownerName, ownerId, onSuccess, initialMemberId }) => {
  const { user } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Combine owner and members into a single list for selection
  const memberOptions = [
    { id: ownerId, name: ownerName, relation: 'Owner' },
    ...members
  ];

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(TransactionSchema),
    defaultValues: {
      type: 'expense',
      member_id: initialMemberId || ownerId,
      amount: 0,
      date: new Date(),
      description: null,
      title: '',
      category: ExpenseCategories[0],
      source: IncomeSources[0],
      payment_type: PaymentTypes[0],
    },
  });

  const transactionType = form.watch('type');

  const onSubmit = async (data: TransactionFormValues) => {
    if (!user) return;
    setIsSubmitting(true);

    try {
      const baseData = {
        user_id: user.id,
        member_id: data.member_id === ownerId ? null : data.member_id, // Set member_id to null if it's the owner's ID
        amount: data.amount,
        description: data.description,
      };

      if (data.type === 'expense') {
        const expenseData = {
          ...baseData,
          title: data.title!,
          category: data.category!,
          expense_date: format(data.date, 'yyyy-MM-dd'),
          payment_type: data.payment_type || null,
          receipt_url: null, // Simplified: Receipt upload handled separately if needed, but not in this unified form
        };
        
        const { error } = await supabase.from('expenses').insert(expenseData);
        if (error) throw error;
        showSuccess('Expense added successfully!');

      } else { // Income
        const incomeData = {
          ...baseData,
          source: data.source!,
          date: format(data.date, 'yyyy-MM-dd'),
        };
        
        const { error } = await supabase.from('income').insert(incomeData);
        if (error) throw error;
        showSuccess('Income added successfully!');
      }
      
      form.reset({
        ...form.getValues(),
        amount: 0,
        title: '',
        description: null,
      });
      onSuccess();

    } catch (error: any) {
      showError('Transaction failed: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        
        {/* Transaction Type Selector */}
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Transaction Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="expense">
                    <div className="flex items-center"><TrendingDown className="h-4 w-4 mr-2 text-destructive" /> Expense</div>
                  </SelectItem>
                  <SelectItem value="income">
                    <div className="flex items-center"><TrendingUp className="h-4 w-4 mr-2 text-green-600" /> Income</div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Member Selector */}
        <FormField
          control={form.control}
          name="member_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Family Member</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select member" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {memberOptions.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.name} ({member.relation || 'Owner'})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          {/* Amount */}
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount (₹)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Date */}
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Conditional Fields for Expense */}
        {transactionType === 'expense' && (
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Groceries, Rent, etc." {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {ExpenseCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="payment_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value || undefined}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {PaymentTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        {/* Conditional Fields for Income */}
        {transactionType === 'income' && (
          <FormField
            control={form.control}
            name="source"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Source</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select income source" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {IncomeSources.map((source) => (
                      <SelectItem key={source} value={source}>
                        {source}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes (Optional)</FormLabel>
              <FormControl>
                <Textarea placeholder="Details about the transaction..." {...field} value={field.value ?? ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            `Log ${transactionType === 'expense' ? 'Expense' : 'Income'}`
          )}
        </Button>
      </form>
    </Form>
  );
};

export default MemberTransactionForm;