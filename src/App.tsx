import { BrowserRouter, Route, Routes } from "react-router";
import LandingPage from "./pages/LandingPage";
import SettingsPage from "./pages/SettingsPage";
import UploadPage from "./pages/UploadsPage";
import StatusPage from "./pages/StatusPage";

const Router = () => {
	return <BrowserRouter>
		<Routes>
			<Route path="/" element={<LandingPage />} />
			<Route path="/settings" element={<SettingsPage />} />
			<Route path="/upload" element={<UploadPage />} />
			<Route path="/status" element={<StatusPage />} />
		</Routes>
	</BrowserRouter>
};

export default Router;