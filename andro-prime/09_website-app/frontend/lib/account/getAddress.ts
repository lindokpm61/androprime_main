import { createSupabaseServerClient } from '@/lib/supabase/server'

// The delivery address held on the user's `users` row. These are the exact
// columns the second-kit dispatch snapshots at send time
// (lib/bundles/dispatch.ts), so this surface edits the same source of truth the
// bundle sweep ships to. `county` maps to the `address_county` column (it fills
// the Vitall `state` slot); `country` defaults to 'GB' at the DB level.
export interface AddressData {
  firstName: string
  lastName: string
  line1: string
  line2: string
  city: string
  county: string
  postalCode: string
  country: string
}

export const EMPTY_ADDRESS: AddressData = {
  firstName: '',
  lastName: '',
  line1: '',
  line2: '',
  city: '',
  county: '',
  postalCode: '',
  country: 'GB',
}

export async function getAddress(userId: string): Promise<AddressData> {
  const supabase = await createSupabaseServerClient()

  const { data } = await supabase
    .from('users')
    .select(
      'first_name, last_name, address_line1, address_line2, address_city, address_county, address_postal_code, address_country',
    )
    .eq('id', userId)
    .single()

  if (!data) return EMPTY_ADDRESS

  return {
    firstName: data.first_name ?? '',
    lastName: data.last_name ?? '',
    line1: data.address_line1 ?? '',
    line2: data.address_line2 ?? '',
    city: data.address_city ?? '',
    county: data.address_county ?? '',
    postalCode: data.address_postal_code ?? '',
    country: data.address_country ?? 'GB',
  }
}
