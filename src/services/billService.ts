import { supabase } from '../lib/supabase';
import { WebhookResponse } from '../components/FileUpload';

export async function saveBillToDatabase(
  billData: WebhookResponse,
  userAssignments: Record<number, string[]>
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

  const billItems = billData.data.map((item) => ({
    bill_id: bill.id,
    name: item.name,
    quantity: item.quantity,
    price: item.price,
    total: item.total,
  }));

  const { data: insertedItems, error: itemsError } = await supabase
    .from('bill_items')
    .insert(billItems)
    .select();

  if (itemsError || !insertedItems) {
    throw new Error(`Failed to save bill items: ${itemsError?.message || 'Unknown error'}`);
  }

  for (let i = 0; i < insertedItems.length; i++) {
    const userIds = userAssignments[i] || [];
    if (userIds.length > 0) {
      const billItemUsers = userIds.map((userId) => ({
        bill_item_id: insertedItems[i].id,
        user_id: userId,
      }));

      const { error: linkError } = await supabase
        .from('bill_item_users')
        .insert(billItemUsers);

      if (linkError) {
        throw new Error(`Failed to assign users to item: ${linkError.message}`);
      }
    }
  }
}
