import { IUser } from "@/utils/types"
import { HiExclamation } from "react-icons/hi"

interface IAccessWrapperProps {
  user: IUser | null
  // accessRole: IUserRole[]
  // accessToken: IUser["accessToken"]
  accessRole: boolean
  children: React.ReactNode
}

const AccessWrapper: React.FunctionComponent<IAccessWrapperProps> = ({
  user,
  // accessToken,
  accessRole,
  children,
}) => {
  // console.log("User coming is ",user);
  // console.log("Access role coming is ",accessRole);
  // console.log("Token conming is ",accessToken)

  if (!user || !user.role || !accessRole) {
    console.log("role in Accesswrapper: ", user?.role)
    return (
      <div className="w-full items-center justify-center pt-24 md:pt-48 lg:pt-54">
        <div className="font-bold text-3xl px-6 text-center flex items-center justify-center">
          <HiExclamation className="w-10 h-10 text-error" />
        </div>
        <div className="px-6 text-lg text-center">Not Authorized</div>
      </div>
    )
  }

  // If user exists and has role, show children
  return <div className="w-full">{children}</div>
}

// <div className="w-full">
//   {accessRole.includes(user.role) ? (
//     children
//   ) : (
//     <div className="w-full items-center justify-center pt-24 md:pt-48 lg:pt-54">
//       <div className="font-bold text-3xl px-6 text-center flex items-center justify-center">
//         <HiExclamation className="w-10 h-10 text-error" />
//       </div>
//       <div className="px-6 text-lg text-center">Not Authorized</div>
//     </div>
//   )}
// </div>
//   )
// }

export default AccessWrapper