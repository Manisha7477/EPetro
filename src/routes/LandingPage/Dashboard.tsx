import React from "react"
interface INavbarProps {
  isOpenMenu: boolean
}

const Dashboard: React.FunctionComponent<INavbarProps> = ({ isOpenMenu }) => {
  return (
     <div className="flex flex-col py-2 gap-1 h-full w-full">
      My Dashboard
    </div>
  )
}

export default Dashboard