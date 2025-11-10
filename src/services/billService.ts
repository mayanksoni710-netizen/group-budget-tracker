import { supabase } from '../lib/supabase';
import { WebhookResponse } from '../components/FileUpload';

export async function saveBillToDatabase(
  billData: WebhookResponse,
  userAssignments: Record<number, string>
): Promise<void> {
  const { data: bill, error: billError } = await supabase
    .from('bills')
    .insert({
      grand_total: billData.grandTotal,
      currency: billData.currency,
    })
    .select()
    .maybeSingle();

  if (billError || !bill) {
    throw new Error(`Failed to save bill: ${billError?.message || 'Unknown error'}`);
  }

  const billItems = billData.data.map((item, index) => ({
    bill_id: bill.id,
    name: item.name,
    quantity: item.quantity,
    price: item.price,
    total: item.total,
    assigned_user: userAssignments[index] || null,
  }));

  const { error: itemsError } = await supabase.from('bill_items').insert(billItems);

  if (itemsError) {
    throw new Error(`Failed to save bill items: ${itemsError.message}`);
  }
}
