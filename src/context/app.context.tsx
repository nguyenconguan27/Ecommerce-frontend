import { createContext, useState } from 'react'
// import { ExtendedPurchases } from 'src/types/purchase.type'
import { User } from 'src/types/user.type'
import { getAccessTokenFromLS, getProfileFromLS } from 'src/utils/auth'

interface CheckoutData {
  orderIdList: number[]
  shippingInfo: number
  payMethod: number
}
interface AppContextInterfact {
  isAuthenticated: boolean
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
  setCheckoutData: React.Dispatch<React.SetStateAction<CheckoutData | null>>
  checkoutData: CheckoutData | null
  profile: User | null
  setProfile: React.Dispatch<React.SetStateAction<User | null>>
  //   extendedPurchases: ExtendedPurchases[]
  //   setExtendedPurchases: React.Dispatch<React.SetStateAction<ExtendedPurchases[]>>
  reset: () => void
}

const initialAppContext: AppContextInterfact = {
  isAuthenticated: Boolean(getAccessTokenFromLS()),
  setIsAuthenticated: () => null,
  setCheckoutData: () => null,
  checkoutData: null,
  profile: getProfileFromLS(),
  setProfile: () => null,
  //   extendedPurchases: [],
  //   setExtendedPurchases: () => null,
  reset: () => null
}

export const AppContext = createContext<AppContextInterfact>(initialAppContext)

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(initialAppContext.isAuthenticated)
  const [profile, setProfile] = useState<User | null>(initialAppContext.profile)
  //   const [extendedPurchases, setExtendedPurchases] = useState<ExtendedPurchases[]>(initialAppContext.extendedPurchases)
  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(initialAppContext.checkoutData)
  const reset = () => {
    setIsAuthenticated(false)
    setProfile(null)
    setCheckoutData(null)
    // setExtendedPurchases([])
  }
  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        setCheckoutData,
        checkoutData,
        setIsAuthenticated,
        profile,
        setProfile,
        // extendedPurchases,
        // setExtendedPurchases,
        reset
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
