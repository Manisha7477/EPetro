import { useAuth } from "@/contexts/auth"
import Home from "@/routes/Home"
import NotFound from "@/routes/NotFound"
import Profile from "@/routes/Profile"
import Settings from "@/routes/Settings"
import SignOut from "@/routes/SignOut"
import nookies from "nookies"
import { useEffect, useState } from "react"
import { Route, Routes } from "react-router-dom"
import AccessWrapper from "./AccessWrapper"
import MyDashboard from "./MyDashboard"
import ManageUsers from "./UserManagement/ManageUsers"
import RoleAssignment from "./UserManagement/RoleAssignment"
import RoleAssignmentConfiguration from "./UserManagement/RoleAssignmentConfiguration"
import RolePermission from "./UserManagement/RolePermission"
import UserIdCreation from "./UserManagement/UserIdCreation"

import api from "@/api/axiosInstance"
import AlarmTrace from "./Alarms/AlarmTrace"
import DigitalLog from "./DigitalLogbook/DigitalLog"
import MocHeader from "@/components/moc/MocHeader"

interface INavbarProps {
  isOpenMenu: boolean
}

const AppRouter: React.FunctionComponent<INavbarProps> = ({ isOpenMenu }) => {
  const { user, loading } = useAuth()
  const token = nookies.get(null).accessToken || ""
  const [loadingRoles, setLoadingRoles] = useState(true)
  const [roleMap, setRoleMap] = useState(new Map())

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await api.get("/User/GetSubMenuWithRoles")
        console.log("Roles response:", response.data)
        const rolesMap = new Map<string, string[]>()

        response.data.forEach(
          (submenu: {
            subMenuName: string
            subMenuUrl: string
            getRoleList: { roleName: string }[]
          }) => {
            const roleNames = submenu.getRoleList.map((role) => role.roleName)

            // We need a key for the map; if subMenuUrl is blank, use subMenuId or subMenuName
            const key = submenu.subMenuUrl || submenu.subMenuName

            rolesMap.set(key, roleNames)
          },
        )

        setRoleMap(rolesMap)
      } catch (error) {
        console.error("Error fetching roles:", error)
      } finally {
        setLoadingRoles(false)
      }
    }

    fetchRoles()
  }, [token])
  if (!loading && !loadingRoles) {
    return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/my-dashboard"
          element={
            <MyDashboard
              user={user}
              isOpenMenu={isOpenMenu}
              // accessToken={token}
            />
          }
        />
        <Route
          path="/manage-users"
          element={
            <AccessWrapper
              user={user}
              // accessToken={token}
              accessRole={roleMap.get("/manage-users")?.includes(user?.role)}
            >
              <ManageUsers />
            </AccessWrapper>
          }
        />
        <Route
          path="/manage-users/user-creation"
          element={
            <AccessWrapper
              user={user}
              accessRole={roleMap
                .get("/manage-users")
                ?.includes(user?.role || "")}
            >
              <UserIdCreation user={user} />
            </AccessWrapper>
          }
        />
        <Route
          path="/user-mapping"
          element={
            <AccessWrapper
              user={user}
              accessRole={roleMap.get("/user-mapping")?.includes(user?.role)}
            >
              <RoleAssignment />
            </AccessWrapper>
          }
        />
        <Route
          path="/user-mapping/configuration"
          element={
            <AccessWrapper
              user={user}
              accessRole={roleMap
                .get("/user-mapping")
                ?.includes(user?.role || "")}
            >
              <RoleAssignmentConfiguration user={user} />
            </AccessWrapper>
          }
        />
        <Route
          path="/role-permission"
          element={
            <AccessWrapper
              user={user}
              accessRole={roleMap
                .get("/role-permission")
                ?.includes(user?.role || "")}
            >
              <RolePermission />
            </AccessWrapper>
          }
        />
        {/* <Route
          path="/on-plant"
          element={
            <AccessWrapper
              user={user}
              accessRole={roleMap.get("/on-plant")?.includes(user?.role || "")}
            >
              <ManagePlants />
            </AccessWrapper>
          }
        /> */}
        {/* <Route
          path="/on-plant/configuration"
          element={
            <AccessWrapper
              user={user}
              accessRole={roleMap.get("/on-plant")?.includes(user?.role || "")}
            >
              <ManagePlantConfiguration user={user} />
            </AccessWrapper>
          }
        />
        <Route
          path="/on-plant/configuration/update"
          element={
            <AccessWrapper
              user={user}
              accessRole={roleMap.get("/on-plant")?.includes(user?.role || "")}
            >
              <UpdatePlantConfiguration user={user} />
            </AccessWrapper>
          }
        />
        <Route
          path="/area"
          element={
            <AccessWrapper
              user={user}
              accessRole={roleMap.get("/area")?.includes(user?.role || "")}
            >
              <ManageArea />
            </AccessWrapper>
          }
        />
        <Route
          path="/area/configuration"
          element={
            <AccessWrapper
              user={user}
              accessRole={roleMap.get("/area")?.includes(user?.role || "")}
            >
              <ManageAreaConfiguration user={user} />
            </AccessWrapper>
          }
        />
        <Route
          path="/area/configuration/update"
          element={
            <AccessWrapper
              user={user}
              accessRole={roleMap.get("/area")?.includes(user?.role || "")}
            >
              <AreaUpdateConfiguration user={user} />
            </AccessWrapper>
          }
        />
        <Route
          path="/line"
          element={
            <AccessWrapper
              user={user}
              accessRole={roleMap.get("/line")?.includes(user?.role || "")}
            >
              <ManageLines />
            </AccessWrapper>
          }
        />
        <Route
          path="/line/configuration"
          element={
            <AccessWrapper
              user={user}
              accessRole={roleMap.get("/line")?.includes(user?.role || "")}
            >
              <ManageLineConfiguration user={user} />
            </AccessWrapper>
          }
        />
        <Route
          path="/line/configuration/update"
          element={
            <AccessWrapper
              user={user}
              accessRole={roleMap.get("/line")?.includes(user?.role || "")}
            >
              <UpdateLineConfiguration user={user} />
            </AccessWrapper>
          }
        /> */}

        {/* Edge Devices */}
        {/* <Route
          path="/edge-devices"
          element={
            <AccessWrapper
              user={user}
              accessRole={roleMap
                .get("/edge-devices")
                ?.includes(user?.role || "")}
            >
              <ManageEdgeDevice />
            </AccessWrapper>
          }
        /> */}
        {/* <Route
          path="/edge-devices/configuration"
          element={
            <AccessWrapper
              user={user}
              accessRole={roleMap
                .get("/edge-devices")
                ?.includes(user?.role || "")}
            >
              <ManageEdgeDeviceConfiguration user={user} />
            </AccessWrapper>
          }
        />
        <Route
          path="/edge-devices/configuration/update"
          element={
            <AccessWrapper
              user={user}
              accessRole={roleMap
                .get("/edge-devices")
                ?.includes(user?.role || "")}
            >
              <UpdateEdgeDeviceConfiguration user={user} />
            </AccessWrapper>
          }
        />

        <Route
          path="/utilities"
          element={
            <AccessWrapper
              user={user}
              accessRole={roleMap.get("/utilities")?.includes(user?.role || "")}
            >
              <UtilityHeader />
            </AccessWrapper>
          }
        />

        <Route
          path="/utilities/boiler"
          element={
            <AccessWrapper
              user={user}
              accessRole={roleMap.get("/utilities")?.includes(user?.role || "")}
            >
              <ManageBoiler />
            </AccessWrapper>
          }
        />
        <Route
          path="/utilities/boiler/configuration"
          element={
            <AccessWrapper
              user={user}
              accessRole={roleMap.get("/utilities")?.includes(user?.role || "")}
            >
              <ManageConfigurationBoiler user={null} />
            </AccessWrapper>
          }
        />
        <Route
          path="/utilities/boiler/configuration/update"
          element={
            <AccessWrapper
              user={user}
              accessRole={roleMap.get("/utilities")?.includes(user?.role || "")}
            >
              <ManageUpdateBoiler user={user} />
            </AccessWrapper>
          }
        />
        <Route
          path="/utilities/chiller"
          element={
            <AccessWrapper
              user={user}
              accessRole={roleMap.get("/utilities")?.includes(user?.role || "")}
            >
              <ManageChiller />
            </AccessWrapper>
          }
        />
        <Route
          path="/utilities/chiller/configuration"
          element={
            <AccessWrapper
              user={user}
              accessRole={roleMap.get("/utilities")?.includes(user?.role || "")}
            >
              <ManageConfigurationChiller user={null} />
            </AccessWrapper>
          }
        />
        <Route
          path="/utilities/chiller/configuration/update"
          element={
            <AccessWrapper
              user={user}
              accessRole={roleMap.get("/utilities")?.includes(user?.role || "")}
            >
              <ManageUpdateChiller user={user} />
            </AccessWrapper>
          }
        />
        <Route
          path="/utilities/air-compressor"
          element={
            <AccessWrapper
              user={user}
              accessRole={roleMap.get("/utilities")?.includes(user?.role || "")}
            >
              <ManageAirCompressor />
            </AccessWrapper>
          }
        />
        <Route
          path="/utilities/air-compressor/configuration"
          element={
            <AccessWrapper
              user={user}
              accessRole={roleMap.get("/utilities")?.includes(user?.role || "")}
            >
              <ManageConfigurationAirCompressor user={null} />
            </AccessWrapper>
          }
        />
        <Route
          path="/utilities/air-compressor/configuration/update"
          element={
            <AccessWrapper
              user={user}
              accessRole={roleMap.get("/utilities")?.includes(user?.role || "")}
            >
              <ManageUpdateAirCompressor user={user} />
            </AccessWrapper>
          }
        />
        <Route
          path="/utilities/generator"
          element={
            <AccessWrapper
              user={user}
              accessRole={roleMap.get("/utilities")?.includes(user?.role || "")}
            >
              <ManageGenerator />
            </AccessWrapper>
          }
        />
        <Route
          path="/utilities/generator/configuration"
          element={
            <AccessWrapper
              user={user}
              accessRole={roleMap.get("/utilities")?.includes(user?.role || "")}
            >
              <ManageConfigurationGenerator user={null} />
            </AccessWrapper>
          }
        />
        <Route
          path="/utilities/generator/configuration/update"
          element={
            <AccessWrapper
              user={user}
              accessRole={roleMap.get("/utilities")?.includes(user?.role || "")}
            >
              <ManageUpdateGenerator user={user} />
            </AccessWrapper>
          }
        /> */}

        {/* Plant Performance  View Page*/}
        <Route
          path="/plantPerformanceUtilities"
          element={
            <AccessWrapper
              user={user}
              accessRole={roleMap
                .get("/plantPerformanceUtilities")
                ?.includes(user?.role || "")}
            >
              <MocHeader />
            </AccessWrapper>
          }
        />
        {/* Gen. View Page*/}
        {/* <Route
          path="/plantPerformanceUtilities/:plantName/:lineName/Generator"
          element={
            <AccessWrapper
              user={user}
              accessRole={roleMap
                .get("/plantPerformanceUtilities")
                ?.includes(user?.role || "")}
            >
              <PPViewGenerator />
            </AccessWrapper>
          }
        /> */}

        {/* Gen. Detail Page*/}

        {/* <Route
          path="/plantPerformanceUtilities/:plantName/:lineName/Generator/:id"
          element={
            <AccessWrapper
              user={user}
              accessRole={roleMap
                .get("/plantPerformanceUtilities")
                ?.includes(user?.role || "")}
            >
              <GeneratorDetailsPage />
            </AccessWrapper>
          }
        >
          <Route index element={<GenInfoAndKPI />} />

          <Route path="monitoring">
            <Route index element={<GenMonitoring />} />

            <Route
              path="energyProduced"
              element={<EnergyProducedDetail utilityType="generator" />}
            />
            <Route
              path="Thd-I"
              element={<ThdCurrentDetail utilityType="generator" />}
            />
            <Route
              path="Thd-V"
              element={<ThdVoltageDetail utilityType="generator" />}
            />

            <Route
              path="phaseWiseVoltage"
              element={<UtilityPhaseWiseVoltageDetail type="generator" />}
            />
            <Route
              path="lineWiseVoltage"
              element={<UtilityLineWiseVoltageDetail type="generator" />}
            />

            <Route
              path="activePower"
              element={<UtilityActivePowerDetail type="generator" />}
            />
            <Route
              path="reactivePower"
              element={<UtilityReactivePowerDetail type="generator" />}
            />
            <Route
              path="apparentPower"
              element={<UtilityApparentPowerDetail type="generator" />}
            />

            <Route
              path="kWhEnergy"
              element={<UtilityEnergyConsumptionKwhDetail type="generator" />}
            />
            <Route
              path="kVArhEnergy"
              element={<UtilityEnergyConsumptionKvarhDetail type="generator" />}
            />

            <Route
              path="kVAhEnergy"
              element={<UtilityEnergyConsumptionKvahDetail type="generator" />}
            />
            <Route
              path="current"
              element={<UtilityCurrentDetail type="generator" />}
            />
            <Route
              path="frequency"
              element={<UtilityFrequencyDetail type="generator" />}
            />
            <Route
              path="powerFactor"
              element={<UtilityPowerFactorDetail type="generator" />}
            />
          </Route>
        </Route> */}
        {/* Boiler View Page*/}

        {/* <Route
          path="/plantPerformanceUtilities/:plantName/:lineName/Boiler"
          element={
            <AccessWrapper
              user={user}
              accessRole={roleMap
                .get("/plantPerformanceUtilities")
                ?.includes(user?.role || "")}
            >
              <PPViewBoiler />
            </AccessWrapper>
          }
        />
        <Route
          path="/plantPerformanceUtilities/:plantName/:lineName/boiler/:id"
          element={
            <AccessWrapper
              user={user}
              accessRole={roleMap
                .get("/plantPerformanceUtilities")
                ?.includes(user?.role || "")}
            >
              <BoilerDetailsPage />
            </AccessWrapper>
          }
        >
          <Route index element={<BoilerInfoAndKPI />} />

          <Route path="monitoring">
            <Route index element={<BoilerMonitoring />} />
            <Route
              path="energyProduced"
              element={<EnergyProducedDetail utilityType="boiler" />}
            />
            <Route
              path="Thd-I"
              element={<ThdCurrentDetail utilityType="boiler" />}
            />
            <Route
              path="Thd-V"
              element={<ThdVoltageDetail utilityType="boiler" />}
            />

            <Route
              path="phaseWiseVoltage"
              element={<UtilityPhaseWiseVoltageDetail type="boiler" />}
            />
            <Route
              path="lineWiseVoltage"
              element={<UtilityLineWiseVoltageDetail type="boiler" />}
            />

            <Route
              path="activePower"
              element={<UtilityActivePowerDetail type="boiler" />}
            />
            <Route
              path="reactivePower"
              element={<UtilityReactivePowerDetail type="boiler" />}
            />
            <Route
              path="apparentPower"
              element={<UtilityApparentPowerDetail type="boiler" />}
            />

            <Route
              path="kWhEnergy"
              element={<UtilityEnergyConsumptionKwhDetail type="boiler" />}
            />
            <Route
              path="kVArhEnergy"
              element={<UtilityEnergyConsumptionKvarhDetail type="boiler" />}
            />

            <Route
              path="kVAhEnergy"
              element={<UtilityEnergyConsumptionKvahDetail type="boiler" />}
            />
            <Route
              path="current"
              element={<UtilityCurrentDetail type="boiler" />}
            />
            <Route
              path="frequency"
              element={<UtilityFrequencyDetail type="boiler" />}
            />
            <Route
              path="powerFactor"
              element={<UtilityPowerFactorDetail type="boiler" />}
            />
          </Route>
        </Route> */}


        {/* aircompressor View Page*/}
        {/* <Route
          path="/plantPerformanceUtilities/:plantName/:lineName/aircompressor"
          element={
            <AccessWrapper
              user={user}
              accessRole={roleMap
                .get("/plantPerformanceUtilities")
                ?.includes(user?.role || "")}
            >
              <PPViewAirCompressor />
            </AccessWrapper>
          }
        />
        <Route
          path="/plantPerformanceUtilities/:plantName/:lineName/aircompressor/:id"
          element={
            <AccessWrapper
              user={user}
              accessRole={roleMap
                .get("/plantPerformanceUtilities")
                ?.includes(user?.role || "")}
            >
              <AirCompressorDetailsPage />
            </AccessWrapper>
          }
        >
          <Route index element={<AirCompressorInfoAndKPI />} />

          <Route path="monitoring">
            <Route index element={<AirCompressorMonitoring />} />
            <Route
              path="energyProduced"
              element={<EnergyProducedDetail utilityType="airComp" />}
            />
            <Route
              path="Thd-I"
              element={<ThdCurrentDetail utilityType="airComp" />}
            />
            <Route
              path="Thd-V"
              element={<ThdVoltageDetail utilityType="airComp" />}
            />

            <Route
              path="phaseWiseVoltage"
              element={<UtilityPhaseWiseVoltageDetail type="airComp" />}
            />
            <Route
              path="lineWiseVoltage"
              element={<UtilityLineWiseVoltageDetail type="airComp" />}
            />

            <Route
              path="activePower"
              element={<UtilityActivePowerDetail type="airComp" />}
            />
            <Route
              path="reactivePower"
              element={<UtilityReactivePowerDetail type="airComp" />}
            />
            <Route
              path="apparentPower"
              element={<UtilityApparentPowerDetail type="airComp" />}
            />

            <Route
              path="kWhEnergy"
              element={<UtilityEnergyConsumptionKwhDetail type="airComp" />}
            />
            <Route
              path="kVArhEnergy"
              element={<UtilityEnergyConsumptionKvarhDetail type="airComp" />}
            />

            <Route
              path="kVAhEnergy"
              element={<UtilityEnergyConsumptionKvahDetail type="airComp" />}
            />
            <Route
              path="current"
              element={<UtilityCurrentDetail type="airComp" />}
            />
            <Route
              path="frequency"
              element={<UtilityFrequencyDetail type="airComp" />}
            />
            <Route
              path="powerFactor"
              element={<UtilityPowerFactorDetail type="airComp" />}
            />
          </Route>
        </Route> */}

        {/* For PP-Yougurt Line */}
        <Route
          path="/plantPerformanceYogurtLine"
          element={
            <AccessWrapper
              user={user}
              accessRole={roleMap
                .get("/plantPerformanceYogurtLine")
                ?.includes(user?.role || "")}
            >
              <DigitalLog />
            </AccessWrapper>
          }
        />
        {/* <Route
          path="/plantPerformanceYogurtLine/:plantName/:id"
          element={
            <AccessWrapper
              user={user}
              accessRole={roleMap
                .get("/plantPerformanceYogurtLine")
                ?.includes(user?.role || "")}
            >
              <YogurtLineDetailsPage />
            </AccessWrapper>
          }
        >
    
          <Route path="monitoring">
            <Route index element={<YLineMonitoring />} />
            <Route
              path="energyProduced"
              element={<EnergyProducedDetail utilityType="line" />}
            />
            <Route
              path="Thd-I"
              element={<ThdCurrentDetail utilityType="line" />}
            />
            <Route
              path="Thd-V"
              element={<ThdVoltageDetail utilityType="line" />}
            />

            <Route
              path="phaseWiseVoltage"
              element={<UtilityPhaseWiseVoltageDetail type="line" />}
            />
            <Route
              path="lineWiseVoltage"
              element={<UtilityLineWiseVoltageDetail type="line" />}
            />

            <Route
              path="activePower"
              element={<UtilityActivePowerDetail type="line" />}
            />
            <Route
              path="reactivePower"
              element={<UtilityReactivePowerDetail type="line" />}
            />
            <Route
              path="apparentPower"
              element={<UtilityApparentPowerDetail type="line" />}
            />

            <Route
              path="kWhEnergy"
              element={<UtilityEnergyConsumptionKwhDetail type="line" />}
            />
            <Route
              path="kVArhEnergy"
              element={<UtilityEnergyConsumptionKvarhDetail type="line" />}
            />

            <Route
              path="kVAhEnergy"
              element={<UtilityEnergyConsumptionKvahDetail type="line" />}
            />
            <Route
              path="current"
              element={<UtilityCurrentDetail type="line" />}
            />
            <Route
              path="frequency"
              element={<UtilityFrequencyDetail type="line" />}
            />
            <Route
              path="powerFactor"
              element={<UtilityPowerFactorDetail type="line" />}
            />
          </Route>
        </Route> */}

        {/* For Testing SignAL R -- Alarms Trace*/}
        <Route
          path="/alarms-trace"
          element={
            <AccessWrapper
              user={user}
              accessRole={roleMap
                .get("/alarms-trace")
                ?.includes(user?.role || "")}
            >
              {/* <SignalRTest genId={1} /> */}
              <AlarmTrace />
            </AccessWrapper>
          }
        />

        {/* For Alarms - Alarms Trends */}
        {/* <Route
          path="/alarms-trends"
          element={
            <AccessWrapper
              user={user}
              accessRole={roleMap
                .get("/alarms-trends")
                ?.includes(user?.role || "")}
            >
              <AlarmAndNotifications />
            </AccessWrapper>
          }
        /> */}
        <Route path="/profile" element={<Profile user={user} />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/logout" element={<SignOut />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    )
  }
  return null
}

export default AppRouter
