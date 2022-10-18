import {BrowserRouter, Route, Routes} from "react-router-dom";
import './App.css';
import Home from "./pages/home";
import ResetPassword from "./features/auth/reset_password";
import Login from "./features/auth/login";
import Register from "./features/auth/register";
import Layout from "./layout";
import Dashboard from "./features/dashboard/dashboard";
import FixedSizeGrid from "./features/dashboard/datagird";
import {RequireAuth, RequireManager, RequireUnAuth} from "./shared/permissions";
import EmployeeReports from "./features/dashboard/employeeReports";
import NoPermit from "./pages/no_permit";
import Account from "./features/auth/account";
import PasswordChange from "./features/auth/changepassword";
import {routesConfig} from "./config/RouteConfig";


function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/"
                       element={<Layout/>}
                >
                    <Route index element={
                        <RequireUnAuth>
                            <Home/>
                        </RequireUnAuth>
                    }/>
                    <Route path={routesConfig.LOGIN} element={
                        <RequireUnAuth>
                            <Login/>
                        </RequireUnAuth>
                    }/>
                    <Route path={routesConfig.REGISTER} element={
                        <RequireUnAuth>
                            <Register/>
                        </RequireUnAuth>
                    }/>
                    <Route path={routesConfig.PASSWORD_RESET} element={
                        <RequireUnAuth>
                            <ResetPassword/>
                        </RequireUnAuth>}/>
                    <Route path={routesConfig.NO_PERMIT} element={
                        <RequireUnAuth>
                            <NoPermit/>
                        </RequireUnAuth>}/>

                    <Route path={routesConfig.ACCOUNT} element={
                        <RequireAuth>
                            <Account/>
                        </RequireAuth>
                    }>
                    </Route>
                    <Route path={routesConfig.PASSWORD_CHANGE} element={
                        <RequireAuth>
                            <PasswordChange/>
                        </RequireAuth>
                    }>
                    </Route>

                    <Route path={routesConfig.DASHBOARD} element={
                        <RequireAuth>
                            <Dashboard/>
                        </RequireAuth>
                    }>
                        <Route path={routesConfig.TASKS} element={<FixedSizeGrid/>}/>
                        <Route path={routesConfig.REPORTS} element={
                            <RequireManager>
                                <EmployeeReports/>
                            </RequireManager>
                        }
                        />
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
