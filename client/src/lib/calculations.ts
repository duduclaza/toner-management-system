import type { GramaturaCalculation } from "@/types";

export function calculateGramatura(
  pesoRetornado: number,
  pesoVazio: number,
  gramaturaTotal: number
): GramaturaCalculation {
  const gramaturaPresente = pesoRetornado - pesoVazio;
  const percentual = Math.round((gramaturaPresente / gramaturaTotal) * 100);
  
  let orientacao = '';
  let className = '';
  
  if (percentual >= 0 && percentual <= 5) {
    orientacao = 'Descarte o toner.';
    className = 'bg-red-100 text-red-800 border-red-200';
  } else if (percentual >= 6 && percentual <= 40) {
    orientacao = 'Teste o toner. Se estiver com qualidade boa, use internamente. Se não, descarte.';
    className = 'bg-yellow-100 text-yellow-800 border-yellow-200';
  } else if (percentual >= 41 && percentual <= 80) {
    orientacao = 'Teste o toner. Se estiver com qualidade boa, envie para estoque como semi novo com % descrita na caixa e envie para garantia.';
    className = 'bg-blue-100 text-blue-800 border-blue-200';
  } else if (percentual >= 81 && percentual <= 100) {
    orientacao = 'Teste o toner. Se estiver com qualidade boa, envie para estoque como novo. Se não, envie para garantia.';
    className = 'bg-green-100 text-green-800 border-green-200';
  }
  
  return {
    gramaturaPresente,
    percentual,
    orientacao,
    className
  };
}

export function calculateValorRecuperado(
  percentualGramatura: number,
  capacidade: number,
  precoFolha: number
): number {
  const folhasRestantes = Math.round((percentualGramatura / 100) * capacidade);
  return folhasRestantes * precoFolha;
}
