import React from "react";
import MissionsManager from "../components/MissionsManager";
import { Missao, Militar } from "../types";

interface MissionsPageProps {
  missoes: Missao[];
  militares: Militar[];
  onAddMission: (missao: Missao) => void;
  onAssignMilitar: (militarId: string, missao: Missao) => void;
}

const MissionsPage: React.FC<MissionsPageProps> = (props) => {
  return <MissionsManager {...props} />;
};

export default MissionsPage;
