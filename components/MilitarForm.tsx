import React, { useState, useRef } from "react";
import {
  Camera,
  X,
  Shield,
  User,
  HeartPulse,
  Ruler,
  Scale,
  Briefcase,
  Calendar,
  MapPin,
  Phone,
  Award,
  Mail,
  FileText,
  Activity,
  Heart,
  AlertCircle,
} from "lucide-react";
import {
  Militar,
  Patente,
  Situacao,
  EstadoCivil,
  Unidade,
  TipoPrestacaoServico,
} from "../types";
import {
  PATENTES_LIST,
  SITUACOES_LIST,
  ESTADOS_CIVIS_LIST,
  GRUPOS_SANGUINEOS,
  UNIDADES_LIST,
  TIPOS_PRESTACAO_LIST,
  COMPANHIAS_LIST,
  PELOTOES_LIST,
  SECCOES_LIST,
  EQUIPAS_LIST,
} from "../constants";

interface MilitarFormProps {
  onSubmit: (data: Omit<Militar, "id">) => void;
  initialData?: Militar;
  onCancel: () => void;
}

const MilitarForm: React.FC<MilitarFormProps> = ({
  onSubmit,
  initialData,
  onCancel,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fix: Added missing 'historico' property to match Omit<Militar, 'id'> type in the default state object
  const [formData, setFormData] = useState<Omit<Militar, "id">>(
    initialData
      ? { ...initialData }
      : {
          nip: "",
          patente: Patente.GRUMETE,
          formaPrestacaoServico: "Quadro Permanente",
          tipoPrestacaoServico: TipoPrestacaoServico.QP,
          nome: "",
          bi: "",
          dataNascimento: "",
          sexo: "M",
          grupoSanguineo: "O+",
          altura: "",
          peso: "",
          calcado: "",
          uniforme: "",
          filiacao: { pai: "", mae: "" },
          estadoCivil: EstadoCivil.SOLTEIRO,
          endereco: "",
          telefones: [""],
          email: "",
          contatoAcidente: { nome: "", parentesco: "", telefone: "" },
          formacaoAcademica: "",
          dataIncorporacao: "",
          funcao: "",
          formacaoMilitar: "",
          unidadeMilitar: Unidade.COMANDO_BATALHAO,
          companhia: COMPANHIAS_LIST[0],
          pelotao: PELOTOES_LIST[0],
          seccao: SECCOES_LIST[0],
          equipa: EQUIPAS_LIST[0],
          dataUltimaPromocao: "",
          situacao: Situacao.FORMACAO,
          especialidade: "",
          foto: undefined,
          dataPrevisaoRetorno: "",
          historico: [],
        },
  );

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as any),
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, foto: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const FormSection = ({
    title,
    icon: Icon,
    children,
    description,
  }: {
    title: string;
    icon: any;
    children?: React.ReactNode;
    description?: string;
  }) => (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700 fill-mode-both">
      <div className="flex flex-col md:flex-row md:items-center gap-6 pb-6 border-b border-slate-100">
        <div className="w-14 h-14 bg-slate-950 text-white rounded-2xl flex items-center justify-center shadow-xl">
          <Icon size={28} />
        </div>
        <div>
          <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">
            {title}
          </h3>
          {description && (
            <p className="text-sm font-medium text-slate-400 mt-0.5">
              {description}
            </p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-12">
        {children}
      </div>
    </div>
  );

  const InputField = ({
    label,
    name,
    value,
    type = "text",
    required = false,
    icon: Icon,
    placeholder,
    options,
  }: any) => (
    <div className="space-y-3 group">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 group-focus-within:text-blue-600 transition-colors">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        {Icon && (
          <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors">
            <Icon size={18} />
          </div>
        )}
        {options ? (
          <select
            name={name}
            value={value}
            onChange={handleChange}
            required={required}
            className={`w-full ${Icon ? "pl-14" : "pl-6"} pr-10 py-5 bg-slate-50 border-2 border-transparent rounded-[1.5rem] outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 font-bold text-slate-900 transition-all appearance-none cursor-pointer`}
          >
            {options.map((opt: any) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={type}
            name={name}
            value={value}
            onChange={handleChange}
            required={required}
            placeholder={placeholder}
            className={`w-full ${Icon ? "pl-14" : "pl-6"} pr-6 py-5 bg-slate-50 border-2 border-transparent rounded-[1.5rem] outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 font-bold text-slate-900 transition-all placeholder:text-slate-300`}
          />
        )}
        {options && (
          <div className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            <Calendar size={14} />
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="bg-white p-12 md:p-24 rounded-[4rem] shadow-[0_40px_100px_rgba(0,0,0,0.08)] border border-slate-100 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-24 border-b border-slate-50 pb-16 gap-10">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-1 w-12 bg-blue-600 rounded-full"></div>
            <p className="text-[11px] font-black uppercase tracking-[0.4em] text-blue-600">
              Protocolo de Alistamento
            </p>
          </div>
          <h2 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter leading-none">
            {initialData ? "Atualizar Dossier" : "Adicionar Novo Efetivo"}
          </h2>
          <p className="text-slate-400 font-medium text-lg mt-6 leading-relaxed">
            Registro oficial para integração ao Batalhão de Polícia Naval.
            Certifique-se de validar todos os dados biométricos e documentos de
            identificação.
          </p>
        </div>
        <div className="bg-slate-950 text-white p-10 rounded-[3rem] flex flex-col items-center gap-4 shadow-2xl relative overflow-hidden group">
          <div className="absolute -top-10 -right-10 opacity-5 group-hover:scale-125 transition-transform duration-1000">
            <Shield size={160} />
          </div>
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Shield className="text-white" size={32} />
          </div>
          <div className="text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500 mb-1">
              Status do Sistema
            </p>
            <p className="text-xs font-black uppercase tracking-widest text-white/40">
              BPNav Comando Central
            </p>
          </div>
        </div>
      </div>

      <form
        className="space-y-32"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(formData);
        }}
      >
        {/* Photo Upload Section */}
        <div className="flex flex-col items-center justify-center p-16 bg-slate-50/40 rounded-[4rem] border-2 border-dashed border-slate-200 group hover:border-blue-500 hover:bg-white transition-all duration-500">
          <div className="relative">
            {formData.foto ? (
              <div className="relative animate-in zoom-in duration-500">
                <img
                  src={formData.foto}
                  alt="Militar"
                  className="w-48 h-64 object-cover rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border-8 border-white"
                />
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, foto: undefined }))
                  }
                  className="absolute -top-4 -right-4 bg-red-500 text-white p-4 rounded-full shadow-2xl hover:bg-red-600 transition-all hover:scale-110 active:scale-90"
                >
                  <X size={20} strokeWidth={3} />
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-48 h-64 bg-white rounded-[3rem] border-4 border-slate-100 flex flex-col items-center justify-center cursor-pointer hover:shadow-[0_20px_40px_rgba(0,0,0,0.05)] transition-all group-hover:scale-105 active:scale-95"
              >
                <div className="w-20 h-20 bg-slate-50 text-slate-300 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 mb-6">
                  <Camera size={40} />
                </div>
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] text-center px-8 leading-relaxed">
                  Upload de Foto Oficial
                </p>
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handlePhotoUpload}
            />
          </div>
        </div>

        <FormSection
          title="Identificação de Patente"
          icon={Award}
          description="Dados de registro militar e escalão hierárquico."
        >
          <InputField
            label="NIP"
            name="nip"
            value={formData.nip}
            required
            icon={Shield}
            placeholder="1000XXX"
          />
          <InputField
            label="Patente Oficial"
            name="patente"
            value={formData.patente}
            required
            icon={Award}
            options={PATENTES_LIST}
          />
          <InputField
            label="Tipo de Prestação de Serviço"
            name="tipoPrestacaoServico"
            value={formData.tipoPrestacaoServico}
            required
            icon={Shield}
            options={TIPOS_PRESTACAO_LIST}
          />
          <InputField
            label="Nome Completo"
            name="nome"
            value={formData.nome}
            required
            icon={User}
            placeholder="Nome do militar"
          />
        </FormSection>

        <FormSection
          title="Estado Operacional"
          icon={Activity}
          description="Localização atual e disponibilidade para serviço."
        >
          <InputField
            label="Status de Serviço"
            name="situacao"
            value={formData.situacao}
            required
            icon={Briefcase}
            options={SITUACOES_LIST}
          />
          {(formData.situacao === Situacao.MISSAO ||
            formData.situacao === Situacao.FERIAS) && (
            <div className="animate-in slide-in-from-left-6 duration-500">
              <InputField
                label="Previsão de Retorno"
                name="dataPrevisaoRetorno"
                value={formData.dataPrevisaoRetorno}
                type="date"
                icon={Calendar}
              />
            </div>
          )}
          <InputField
            label="Especialidade Principal"
            name="especialidade"
            value={formData.especialidade}
            required
            icon={Activity}
            placeholder="Ex: Fuzileiro, Logística..."
          />
          <InputField
            label="Unidade Militar"
            name="unidadeMilitar"
            value={formData.unidadeMilitar}
            required
            icon={MapPin}
            options={UNIDADES_LIST}
          />
          <InputField
            label="Companhia"
            name="companhia"
            value={formData.companhia}
            required
            icon={MapPin}
            options={COMPANHIAS_LIST}
          />
          <InputField
            label="Pelotão"
            name="pelotao"
            value={formData.pelotao}
            required
            icon={MapPin}
            options={PELOTOES_LIST}
          />
          <InputField
            label="Secção"
            name="seccao"
            value={formData.seccao}
            required
            icon={MapPin}
            options={SECCOES_LIST}
          />
          <InputField
            label="Equipa"
            name="equipa"
            value={formData.equipa}
            required
            icon={MapPin}
            options={EQUIPAS_LIST}
          />
        </FormSection>

        <FormSection
          title="Biometria e Fardamento"
          icon={HeartPulse}
          description="Dados para prontidão logística e suporte médico."
        >
          <InputField
            label="Grupo Sanguíneo"
            name="grupoSanguineo"
            value={formData.grupoSanguineo}
            required
            icon={Heart}
            options={GRUPOS_SANGUINEOS}
          />
          <InputField
            label="Altura (cm)"
            name="altura"
            value={formData.altura}
            type="number"
            required
            icon={Ruler}
            placeholder="180"
          />
          <InputField
            label="Peso (kg)"
            name="peso"
            value={formData.peso}
            type="number"
            required
            icon={Scale}
            placeholder="80"
          />
          <InputField
            label="Uniforme (Tam)"
            name="uniforme"
            value={formData.uniforme}
            icon={Briefcase}
            placeholder="XL, L, M..."
          />
          <InputField
            label="Calçado (Nº)"
            name="calcado"
            value={formData.calcado}
            type="number"
            icon={Briefcase}
            placeholder="42"
          />
        </FormSection>

        <FormSection
          title="Dados Pessoais e Contato"
          icon={Mail}
          description="Informações civis para registro histórico e emergência."
        >
          <InputField
            label="Bilhete Identidade"
            name="bi"
            value={formData.bi}
            required
            icon={FileText}
            placeholder="000XXXLA000"
          />
          <InputField
            label="Data Nascimento"
            name="dataNascimento"
            value={formData.dataNascimento}
            type="date"
            required
            icon={Calendar}
          />
          <InputField
            label="Estado Civil"
            name="estadoCivil"
            value={formData.estadoCivil}
            required
            icon={User}
            options={ESTADOS_CIVIS_LIST}
          />
          <InputField
            label="Gênero"
            name="sexo"
            value={formData.sexo}
            required
            options={["M", "F"]}
          />
          <InputField
            label="Telefone"
            name="telefones.0"
            value={formData.telefones[0]}
            required
            icon={Phone}
            placeholder="+244..."
          />
          <InputField
            label="Email Oficial"
            name="email"
            value={formData.email}
            type="email"
            icon={Mail}
            placeholder="militar@marinha.mil.ao"
          />
          <div className="col-span-full">
            <InputField
              label="Endereço de Residência"
              name="endereco"
              value={formData.endereco}
              required
              icon={MapPin}
              placeholder="Bairro, Rua, Casa nº"
            />
          </div>
        </FormSection>

        <FormSection
          title="Procedência e Emergência"
          icon={AlertCircle}
          description="Filiação e contatos prioritários para incidentes."
        >
          <InputField
            label="Nome do Pai"
            name="filiacao.pai"
            value={formData.filiacao.pai}
            required
            icon={User}
          />
          <InputField
            label="Nome da Mãe"
            name="filiacao.mae"
            value={formData.filiacao.mae}
            required
            icon={User}
          />
          <InputField
            label="Academia Militar"
            name="formacaoMilitar"
            value={formData.formacaoMilitar}
            required
            icon={Award}
            placeholder="Ex: Academia Naval de Luanda"
          />
          <InputField
            label="Emergência (Nome)"
            name="contatoAcidente.nome"
            value={formData.contatoAcidente.nome}
            required
            icon={User}
            placeholder="Nome do contato"
          />
          <InputField
            label="Parentesco"
            name="contatoAcidente.parentesco"
            value={formData.contatoAcidente.parentesco}
            required
            icon={User}
            placeholder="Ex: Esposa, Pai..."
          />
          <InputField
            label="Emergência (Tel)"
            name="contatoAcidente.telefone"
            value={formData.contatoAcidente.telefone}
            required
            icon={Phone}
            placeholder="Telefone de emergência"
          />
        </FormSection>

        <div className="flex flex-col md:flex-row justify-end items-center gap-10 pt-24 border-t border-slate-100">
          <button
            type="button"
            onClick={onCancel}
            className="px-14 py-6 text-slate-400 hover:text-slate-900 font-black uppercase text-xs tracking-[0.2em] transition-all hover:translate-x-[-10px]"
          >
            Abortar Operação
          </button>
          <button
            type="submit"
            className="w-full md:w-auto px-20 py-7 bg-blue-600 text-white rounded-[2rem] font-black uppercase text-sm tracking-[0.3em] hover:bg-blue-700 transition-all shadow-[0_20px_40px_rgba(37,99,235,0.3)] hover:-translate-y-2 active:translate-y-0 active:scale-95"
          >
            {initialData ? "Validar Alterações" : "Concluir Alistamento"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MilitarForm;
