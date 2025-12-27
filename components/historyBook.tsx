import React, { useState } from "react";

const BookHistoy = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Contenido de las páginas del libro
  const pages = [
    {
      front: {
        title: "Capítulo 1",
        content: "El comienzo de la aventura",
        bg: "bg-amber-50",
        decoration: "🌄",
      },
      back: {
        title: "Página 2",
        content: "Continuación de la historia...",
        bg: "bg-amber-50",
        decoration: "📖",
      },
    },
    {
      front: {
        title: "Página 3",
        content: "El nudo de la trama se desarrolla",
        bg: "bg-blue-50",
        decoration: "🌊",
      },
      back: {
        title: "Página 4",
        content: "Un giro inesperado ocurre",
        bg: "bg-blue-50",
        decoration: "🌀",
      },
    },
    {
      front: {
        title: "Página 5",
        content: "El clímax de la historia",
        bg: "bg-rose-50",
        decoration: "🔥",
      },
      back: {
        title: "Capítulo Final",
        content: "El desenlace de nuestra aventura",
        bg: "bg-rose-50",
        decoration: "🎬",
      },
    },
  ];

  const nextPage = () => {
    if (currentPage < pages.length - 1 && !isAnimating) {
      setIsAnimating(true);
      setCurrentPage((prev) => prev + 1);
      setTimeout(() => setIsAnimating(false), 1000);
    }
  };

  const prevPage = () => {
    if (currentPage > 0 && !isAnimating) {
      setIsAnimating(true);
      setCurrentPage((prev) => prev - 1);
      setTimeout(() => setIsAnimating(false), 1000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-100 to-orange-200 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-amber-900 mb-2">
        Libro Interactivo
      </h1>
      <p className="text-amber-800 mb-8">
        Haz clic en las esquinas para pasar las páginas
      </p>

      <div className="relative w-full max-w-2xl h-96 flex justify-center items-center">
        {/* Contenedor del libro */}
        <div className="relative w-4/5 h-full max-w-md">
          {/* Página izquierda (fija) */}
          <div
            className={`absolute left-0 top-0 w-1/2 h-full ${
              currentPage > 0 ? pages[currentPage - 1].back.bg : "bg-gray-800"
            } rounded-l-lg shadow-2xl p-4 flex flex-col justify-center items-center border-2 border-amber-800 border-r-1`}
          >
            {currentPage > 0 ? (
              <>
                <div className="text-4xl mb-4">
                  {pages[currentPage - 1].back.decoration}
                </div>
                <h2 className="text-xl font-semibold text-center mb-2">
                  {pages[currentPage - 1].back.title}
                </h2>
                <p className="text-center">
                  {pages[currentPage - 1].back.content}
                </p>
              </>
            ) : (
              <div className="text-white text-center">
                <div className="text-4xl mb-4">📚</div>
                <h2 className="text-xl font-semibold">Portada</h2>
                <p>del Libro</p>
              </div>
            )}
          </div>

          {/* Página derecha (fija) - solo visible en la última página */}
          {currentPage === pages.length - 1 && (
            <div className="absolute right-0 top-0 w-1/2 h-full bg-amber-50 rounded-r-lg shadow-2xl p-4 flex flex-col justify-center items-center border-2 border-amber-800 border-l-1">
              <div className="text-4xl mb-4">🏁</div>
              <h2 className="text-xl font-semibold text-center mb-2">
                Fin del Libro
              </h2>
              <p className="text-center">
                ¡Esperamos que hayas disfrutado la lectura!
              </p>
            </div>
          )}

          {/* Página que gira (si no es la última) */}
          {currentPage < pages.length - 1 && (
            <div
              className={`absolute right-0 top-0 w-1/2 h-full origin-left transition-transform duration-1000 ${
                isAnimating ? "rotate-y-180" : ""
              } preserve-3d`}
              style={{ zIndex: 10 }}
            >
              {/* Cara frontal (derecha) */}
              <div
                className={`absolute w-full h-full backface-hidden ${pages[currentPage].front.bg} rounded-r-lg shadow-2xl p-4 flex flex-col justify-center items-center border-2 border-amber-800 border-l-1`}
              >
                <div className="text-4xl mb-4">
                  {pages[currentPage].front.decoration}
                </div>
                <h2 className="text-xl font-semibold text-center mb-2">
                  {pages[currentPage].front.title}
                </h2>
                <p className="text-center">
                  {pages[currentPage].front.content}
                </p>

                {/* Esquina para pasar página */}
                {currentPage < pages.length - 1 && (
                  <div
                    className="absolute bottom-4 right-4 w-8 h-8 bg-amber-700 bg-opacity-30 rounded-tl-full cursor-pointer hover:bg-opacity-50 transition-all duration-300 flex items-start justify-end p-1"
                    onClick={nextPage}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-amber-900"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                )}
              </div>

              {/* Cara trasera (izquierda) - se convierte en la página izquierda después del giro */}
              <div
                className={`absolute w-full h-full backface-hidden rotate-y-180 ${pages[currentPage].back.bg} rounded-l-lg p-4 flex flex-col justify-center items-center border-2 border-amber-800 border-r-1`}
              >
                <div className="text-4xl mb-4">
                  {pages[currentPage].back.decoration}
                </div>
                <h2 className="text-xl font-semibold text-center mb-2">
                  {pages[currentPage].back.title}
                </h2>
                <p className="text-center">{pages[currentPage].back.content}</p>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* navegacion */}
      <div className="mt-8 flex flex-col items-center">
        <div className="flex space-x-4 mb-4">
          <button
            onClick={prevPage}
            disabled={currentPage === 0 || isAnimating}
            className="px-4 py-2 bg-amber-700 text-white rounded-lg shadow-md hover:bg-amber-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300 font-medium flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Página anterior
          </button>

          <button
            onClick={nextPage}
            disabled={currentPage >= pages.length - 1 || isAnimating}
            className="px-4 py-2 bg-amber-700 text-white rounded-lg shadow-md hover:bg-amber-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300 font-medium flex items-center"
          >
            Página siguiente
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 ml-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        <div className="text-amber-900 font-medium">
          Página {currentPage * 2 + 1} de {pages.length * 2}
        </div>

        <p className="mt-4 text-amber-800 text-center max-w-md">
          La animación simula el giro de página de un libro real, donde cada
          página rota desde el centro hacia el lado opuesto.
        </p>
      </div>
    </div>
  );
};

export { BookHistoy };
