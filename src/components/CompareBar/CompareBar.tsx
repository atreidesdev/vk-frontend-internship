import { $compareList, clearCompare, removeFromCompare } from "@/store/compare";
import { getTitle } from "@/utils/movie";
import { Button, Cell, Div, Spacing, Title } from "@vkontakte/vkui";
import { useUnit } from "effector-react";
import { useNavigate } from "react-router-dom";

export function CompareBar() {
  const navigate = useNavigate();
  const list = useUnit($compareList);

  if (list.length === 0) return null;

  return (
    <Div>
      <div
        style={{
          padding: 12,
          background: "var(--vkui--color_background_secondary)",
          borderRadius: 12,
        }}
      >
        <Title level="3" style={{ marginBottom: 8 }}>
          Сравнение ({list.length}/2)
        </Title>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
          {list.map((m) => (
            <Cell
              key={m.id}
              subtitle="убрать"
              onClick={() => removeFromCompare(m.id)}
              style={{ cursor: "pointer", flex: "1 1 auto", minWidth: 120 }}
            >
              {getTitle(m)}
            </Cell>
          ))}
          <Spacing size={8} />
          <Button size="s" mode="secondary" onClick={() => navigate("/compare")}>
            Таблица
          </Button>
          <Button size="s" mode="tertiary" onClick={() => clearCompare()}>
            Очистить
          </Button>
        </div>
      </div>
    </Div>
  );
}
