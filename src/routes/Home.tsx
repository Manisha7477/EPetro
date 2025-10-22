import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

interface IHomeProps {
  // accessToken: string // Add the accessToken property here
}

const Home: React.FunctionComponent<IHomeProps> = ({}) => {
  const navigate = useNavigate()

  useEffect(() => {
    navigate("my-dashboard")
  }, [])

  return <></>
}

export default Home

// import { useEffect } from "react"
// import { useNavigate } from "react-router-dom"

// interface IHomeProps {}

// const Home: React.FunctionComponent<IHomeProps> = ({}) => {
//   const navigate = useNavigate()
//   console.log("Home component rendered")
//   useEffect(() => {
//     console.log("Coming to Home component")
//     navigate("/energy-monitoring/my-dashboard")
//   }, [])

//   return <>{/* <h1>HEllo world </h1> */}</>
// }

// export default Home
