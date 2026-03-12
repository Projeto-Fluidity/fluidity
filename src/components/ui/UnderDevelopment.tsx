import AppLayout from "../layout/AppLayout";

/**
 * Componente utilizado para indicar
 * funcionalidades que ainda estão em desenvolvimento.
 */
type Props = {
  title: string;
  description?: string;
};

export default function UnderDevelopment({
  title,
  description,
}: Props) {
  return (
    <AppLayout>
      <div className="flex flex-col items-center justify-center text-center space-y-6">

        <div className="text-5xl">
          🚧
        </div>

        <h1 className="text-xl font-semibold text-gray-800">
          {title}
        </h1>

        <p className="text-gray-500 max-w-sm">
          {description ??
            "Esta funcionalidade ainda está em desenvolvimento. Em breve estará disponível."}
        </p>

      </div>
    </AppLayout>
  );
}
