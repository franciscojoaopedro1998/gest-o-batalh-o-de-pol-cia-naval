import React, { useMemo, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import MilitarDetails from "../components/MilitarDetails";
import { Militar } from "../types";

interface MilitarDetailsPageProps {
  militares: Militar[];
  onUpdate: (updated: Militar) => void;
}

const MilitarDetailsPage: React.FC<MilitarDetailsPageProps> = ({
  militares,
  onUpdate,
}) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const militar = useMemo(
    () => militares.find((m) => m.id === id),
    [militares, id],
  );

  if (!militar) {
    return (
      <div className="p-12 text-center font-bold text-slate-400">
        Militar não encontrado.
      </div>
    );
  }

  useEffect(() => {
    console.log(militar);
  }, [militar]);

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 md:p-12">
      <MilitarDetails
        militar={militar}
        onBack={() => navigate(-1)}
        onUpdate={onUpdate}
      />
    </div>
  );
};

export default MilitarDetailsPage;
