import { AppRoot, SplitCol, SplitLayout } from "@vkontakte/vkui";
import { BrowserRouter } from "react-router-dom";
import "@vkontakte/vkui/dist/vkui.css";
import "@/styles/variables.css";
import { Layout } from "@/components/Layout";
import { Modals } from "@/components/Modals";

export function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AppRoot mode="full">
        <Modals />
        <SplitLayout>
          <SplitCol width="100%">
            <Layout />
          </SplitCol>
        </SplitLayout>
      </AppRoot>
    </BrowserRouter>
  );
}
