export const useAppUser = () => {
  const user = useStrapiUser();
  
  type ExtendedUser = NonNullable<typeof user.value> & { 
    marketing_allowed?: boolean;
  };
  
  return user as Ref<ExtendedUser | null>;
}