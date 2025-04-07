import { Route, Routes } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import { IsLogin, IsNotLogin } from "./utils/userAuth";
import DashboardPage from "./pages/DashboardPage";
import CreateArticlePage from "./pages/CreateArticlePage";
import SettingsPage from "./pages/SettingsPage";

const App = () => {
  return (
    <Routes>
      <Route element={<IsNotLogin />}>
        <Route path="/auth" element={<AuthPage />} />
      </Route>
      <Route element={<IsLogin />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/new-article" element={<CreateArticlePage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
};

export default App;
