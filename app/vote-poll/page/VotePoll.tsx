'use client';

import { useState } from 'react';

export default function VotePollForm() {
  const [vote, setVote] = useState();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (vote === null) {
      alert('Por favor seleeciona Si o No, Antes de votar.');
      return;
    }

    alert(`Gracias por votar: ${vote}`);
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header con decoracion de cafe * */}
        <div className="mb-10 text-center">
          <div className="flex items-center justify-center mb-6">
            <div className='"w-2 h-2 bg-[#8b7355] rounded-full'></div>
            <div className="w-20 h-0.5 bg-[#e5ddd0] mx-2"></div>
            <svg
              className="w-10 h-10 text-[#3d2f1f]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
              />
            </svg>

            <div className="w-20 h-0.5 bg-[#e5ddd0] mx-2"></div>
            <div className="w-2 h-2 bg-[#8b7355] rounded-full"></div>
          </div>

          <h1 className="text-3xl md:text-4xl font-light text-[#3d2f1f] tracking-wide mb-3">
            Votar Consulta Popular
          </h1>
          <p className="text-[#8b7355] font-light">
            Su voto es confidencial y vinculante
          </p>

          {/* Badge de seguridad */}
          <div className="inline-flex items-center space-x-2 mt-6 px-4 py-2 bg-white border border-[#e5ddd0] rounded-full">
            <svg
              className="w-4 h-4 text-[#8b7355]"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-xs font-light text-[#3d2f1f]">
              Voto Seguro
            </span>
          </div>
        </div>

        {/* Card principal con la pregunta */}
        <div className="bg-white rounded-sm shadow-sm p-6 md:p-8 border border-[#e5ddd0] mb-6">
          <div className="flex items-start mb-6">
            <div className="w-10 h-10 bg-[#f5f1eb] rounded-full flex items-center justify-center mr-4 flex-shrink-0 mt-1">
              <svg
                className="w-5 h-5 text-[#8b7355]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h2 className="text-sm font-medium text-[#8b7355] tracking-wide uppercase mb-2">
                Pregunta de la consulta
              </h2>
              <p className="text-lg md:text-xl font-light text-[#3d2f1f] leading-relaxed">
                {/* En un caso real, esta pregunta vendría de tu API o base de datos */}
                ¿Está usted de acuerdo con implementar bicicletas públicas en
                toda la ciudad?
              </p>
            </div>
          </div>

          {/* Linea divisora decorativa */}
          <div className="flex item-center my-6">
            <div className="flex-1 h-px bg-[#e5ddd0]"></div>
            <div className="w-2 h-2 bg-[#8b7355] rounded-full mx-3"></div>
            <div className="flex-1 h-px bg-[#e5ddd0]"></div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <p className="text-sm font-medium text-[#3d2f1f] tracking-wide mb-4">
                Seleccione su voto:
              </p>

              <div className="space-y-3">
                {/* Opcion Si */}
                <label
                  className={`
                    flex items-center p-4 rounded-sm border-2 cursor-pointer transition-all duration-200
                    ${
                      vote === 'Sí'
                        ? 'border-[#3d2f1f] bg-[#3d2f1f] shadow-md'
                        : 'border-[#e5ddd0] bg-[#faf8f5] hover:border-[#8b7355] hover:bg-white'
                    }
                  `}
                >
                  <input
                    type="radio"
                    name="vote"
                    value="si"
                    onChange={() => setVote('Si')}
                    className="sr-only"
                  />
                  <div
                    className={`
                    w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 transition-all
                    ${
                      vote === 'Sí'
                        ? 'border-white bg-white'
                        : 'border-[#8b7355]'
                    }
                  `}
                  >
                    {vote === 'Sí' && (
                      <div className="w-3 h-3 bg-[#3d2f1f] rounded-full"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <span
                      className={`
                      text-lg font-light tracking-wide
                      ${vote === 'Sí' ? 'text-white' : 'text-[#3d2f1f]'}
                    `}
                    >
                      Si
                    </span>
                    <p
                      className={`
                      text-sm font-light mt-1
                      ${vote === 'Sí' ? 'text-[#f5f1eb]' : 'text-[#8b7355]'}
                    `}
                    >
                      Estoy de acuerdo con la propuesta
                    </p>
                  </div>
                  {vote === 'Sí' && (
                    <svg
                      className="w-6 h-6 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </label>

                {/* Opcion No */}
                <label
                  className={`
                    flex items-center p-4 rounded-sm border-2 cursor-pointer transition-all duration-200
                    ${
                      vote === 'No'
                        ? 'border-[#3d2f1f] bg-[#3d2f1f] shadow-md'
                        : 'border-[#e5ddd0] bg-[#faf8f5] hover:border-[#8b7355] hover:bg-white'
                    }
                  `}
                >
                  <input
                    type="radio"
                    name="vote"
                    value="No"
                    onChange={() => setVote('No')}
                    className="sr-only"
                  />
                  <div
                    className={`
                    w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 transition-all
                    ${
                      vote === 'No'
                        ? 'border-white bg-white'
                        : 'border-[#8b7355]'
                    }
                  `}
                  >
                    {vote === 'No' && (
                      <div className="w-3 h-3 bg-[#3d2f1f] rounded-full"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <span
                      className={`
                      text-lg font-light tracking-wide
                      ${vote === 'No' ? 'text-white' : 'text-[#3d2f1f]'}
                    `}
                    >
                      No
                    </span>
                    <p
                      className={`
                      text-sm font-light mt-1
                      ${vote === 'No' ? 'text-[#f5f1eb]' : 'text-[#8b7355]'}
                    `}
                    >
                      No estoy de acuerdo con la propuesta
                    </p>
                  </div>
                  {vote === 'No' && (
                    <svg
                      className="w-6 h-6 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </label>
              </div>
            </div>

            {/* Confirmación de voto seleccionado */}
            {vote && (
              <div className="mb-6 p-4 bg-[#f5f1eb] rounded-sm border border-[#e5ddd0] animate-fadeIn">
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 text-[#8b7355] mr-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-sm text-[#3d2f1f] font-light">
                    Has seleccionado:{' '}
                    <strong className="font-medium">{vote}</strong>
                  </p>
                </div>
              </div>
            )}

            {/* Botón de envío */}
            <button
              type="submit"
              className="w-full bg-[#3d2f1f] text-white font-light tracking-wide py-4 px-6 rounded-sm hover:bg-[#2a1f13] transition-all duration-300 shadow-sm hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <span className="flex items-center justify-center">
                Confirmar y Enviar voto
                <svg
                  className="w-5 h-5 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </span>
            </button>
          </form>
        </div>
        {/* Info box sobre privacidad */}
        <div className="bg-white rounded-sm shadow-sm p-6 border border-[#e5ddd0]">
          <div className="flex items-start space-x-3">
            <svg
              className="w-5 h-5 text-[#8b7355] mt-0.5 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <p className="text-sm text-[#3d2f1f] font-medium mb-2">
            Sobre su voto
          </p>
          <ul className="text-xs text-[#8b7355] font-light space-y-1.5 leading-relaxed">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Su voto es secreto y confidencial</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>El resultado es vinculante para las autoridades</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Solo puede votar una vez en esta consulta</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Los resultados serán publicados oficialmente</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Footer decorativo */}
      <div className="mt-12 text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="w-2 h-2 bg-[#8b7355] rounded-full"></div>
          <div className="w-24 h-0.5 bg-[#e5ddd0] mx-2"></div>
          <div className="w-3 h-3 bg-[#3d2f1f] rounded-full"></div>
          <div className="w-24 h-0.5 bg-[#e5ddd0] mx-2"></div>
          <div className="w-2 h-2 bg-[#8b7355] rounded-full"></div>
        </div>
        <p className="text-xs text-[#b8a896] font-light">
          Su participación fortalece la democracia
        </p>
      </div>
    </div>
  );
}
