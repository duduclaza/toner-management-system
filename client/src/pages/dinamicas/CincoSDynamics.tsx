import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FileText, Target, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CincoSQuestion {
  id: number;
  category: "Seiri" | "Seiton" | "Seiso" | "Seiketsu" | "Shitsuke";
  question: string;
  weight: number;
}

const cincoSQuestions: CincoSQuestion[] = [
  // Seiri (Separar/Organizar)
  {
    id: 1,
    category: "Seiri",
    question: "A área de trabalho possui apenas os itens necessários para as atividades?",
    weight: 2
  },
  {
    id: 2,
    category: "Seiri",
    question: "Materiais desnecessários foram removidos da área?",
    weight: 2
  },
  {
    id: 3,
    category: "Seiri",
    question: "Há separação clara entre itens necessários e desnecessários?",
    weight: 1
  },
  
  // Seiton (Classificar/Arrumar)
  {
    id: 4,
    category: "Seiton",
    question: "Todos os itens têm local específico e identificado para armazenamento?",
    weight: 2
  },
  {
    id: 5,
    category: "Seiton",
    question: "É fácil localizar qualquer item quando necessário?",
    weight: 2
  },
  {
    id: 6,
    category: "Seiton",
    question: "Há demarcação visual clara dos locais de armazenamento?",
    weight: 1
  },
  
  // Seiso (Limpar)
  {
    id: 7,
    category: "Seiso",
    question: "A área de trabalho está sempre limpa e organizada?",
    weight: 2
  },
  {
    id: 8,
    category: "Seiso",
    question: "Equipamentos estão limpos e em bom estado de conservação?",
    weight: 2
  },
  {
    id: 9,
    category: "Seiso",
    question: "Existe rotina definida para limpeza da área?",
    weight: 1
  },
  
  // Seiketsu (Padronizar)
  {
    id: 10,
    category: "Seiketsu",
    question: "Existem padrões definidos para manter a organização?",
    weight: 2
  },
  {
    id: 11,
    category: "Seiketsu",
    question: "Os padrões são seguidos consistentemente por todos?",
    weight: 2
  },
  {
    id: 12,
    category: "Seiketsu",
    question: "Há procedimentos documentados para manutenção da área?",
    weight: 1
  },
  
  // Shitsuke (Disciplina)
  {
    id: 13,
    category: "Shitsuke",
    question: "A equipe mantém os hábitos de organização automaticamente?",
    weight: 2
  },
  {
    id: 14,
    category: "Shitsuke",
    question: "Há comprometimento visível de todos com o método 5S?",
    weight: 2
  },
  {
    id: 15,
    category: "Shitsuke",
    question: "Melhorias são implementadas continuamente?",
    weight: 1
  }
];

interface CincoSDynamicsProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (results: CincoSResults) => void;
}

interface CincoSResults {
  area: string;
  responsavel: string;
  pontuacao: number;
  pontuacaoDetalhada: {
    Seiri: number;
    Seiton: number;
    Seiso: number;
    Seiketsu: number;
    Shitsuke: number;
  };
  observacoes: string;
  dataAvaliacao: string;
  recomendacoes: string[];
}

export function CincoSDynamics({ isOpen, onClose, onComplete }: CincoSDynamicsProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [area, setArea] = useState("");
  const [responsavel, setResponsavel] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [started, setStarted] = useState(false);
  
  const { toast } = useToast();

  const handleStart = () => {
    if (!area || !responsavel) {
      toast({ title: "Preencha área e responsável para iniciar", variant: "destructive" });
      return;
    }
    setStarted(true);
  };

  const handleAnswer = (score: number) => {
    setAnswers(prev => ({ ...prev, [cincoSQuestions[currentQuestion].id]: score }));
    
    if (currentQuestion < cincoSQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      // Calcular resultados
      calculateResults(score);
    }
  };

  const calculateResults = (lastScore: number) => {
    const allAnswers = { ...answers, [cincoSQuestions[currentQuestion].id]: lastScore };
    
    // Calcular pontuação por categoria
    const categorias = ["Seiri", "Seiton", "Seiso", "Seiketsu", "Shitsuke"] as const;
    const pontuacaoDetalhada = {} as CincoSResults['pontuacaoDetalhada'];
    
    categorias.forEach(categoria => {
      const questoesCategoria = cincoSQuestions.filter(q => q.category === categoria);
      let totalPontos = 0;
      let pesoTotal = 0;
      
      questoesCategoria.forEach(questao => {
        const resposta = allAnswers[questao.id] || 0;
        totalPontos += resposta * questao.weight;
        pesoTotal += questao.weight;
      });
      
      pontuacaoDetalhada[categoria] = Math.round((totalPontos / (pesoTotal * 5)) * 100);
    });
    
    // Pontuação geral
    const pontuacaoGeral = Math.round(
      Object.values(pontuacaoDetalhada).reduce((sum, score) => sum + score, 0) / 5
    );
    
    // Gerar recomendações
    const recomendacoes: string[] = [];
    
    if (pontuacaoDetalhada.Seiri < 70) {
      recomendacoes.push("Implementar campanha de identificação e remoção de itens desnecessários");
    }
    if (pontuacaoDetalhada.Seiton < 70) {
      recomendacoes.push("Criar sistema de identificação visual e demarcação de locais");
    }
    if (pontuacaoDetalhada.Seiso < 70) {
      recomendacoes.push("Estabelecer rotina de limpeza e manutenção preventiva");
    }
    if (pontuacaoDetalhada.Seiketsu < 70) {
      recomendacoes.push("Desenvolver procedimentos padrão e checklists de verificação");
    }
    if (pontuacaoDetalhada.Shitsuke < 70) {
      recomendacoes.push("Implementar programa de treinamento e acompanhamento contínuo");
    }
    
    if (recomendacoes.length === 0) {
      recomendacoes.push("Manter o excelente trabalho e buscar melhorias incrementais");
    }
    
    const results: CincoSResults = {
      area,
      responsavel,
      pontuacao: pontuacaoGeral,
      pontuacaoDetalhada,
      observacoes,
      dataAvaliacao: new Date().toISOString().split('T')[0],
      recomendacoes
    };
    
    onComplete(results);
    reset();
  };

  const reset = () => {
    setCurrentQuestion(0);
    setArea("");
    setResponsavel("");
    setObservacoes("");
    setAnswers({});
    setStarted(false);
    onClose();
  };

  const progress = ((currentQuestion + 1) / cincoSQuestions.length) * 100;
  const currentQ = cincoSQuestions[currentQuestion];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Target className="h-5 w-5 mr-2" />
            Avaliação 5S
          </DialogTitle>
        </DialogHeader>

        {!started ? (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Metodologia 5S</h3>
              <p className="text-gray-600 text-sm">
                Avaliação baseada nos 5 pilares: Seiri, Seiton, Seiso, Seiketsu e Shitsuke.
                São {cincoSQuestions.length} questões que avaliam a implementação da metodologia.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="area">Área Avaliada</Label>
                <Input
                  id="area"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="Ex: Produção, Almoxarifado"
                />
              </div>
              <div>
                <Label htmlFor="responsavel">Responsável</Label>
                <Input
                  id="responsavel"
                  value={responsavel}
                  onChange={(e) => setResponsavel(e.target.value)}
                  placeholder="Nome do responsável"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="observacoes">Observações Iniciais (Opcional)</Label>
              <Textarea
                id="observacoes"
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                placeholder="Contexto ou observações sobre a área avaliada..."
                rows={3}
              />
            </div>

            <div className="flex justify-center">
              <Button onClick={handleStart} className="px-8">
                Iniciar Avaliação
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">
                  Questão {currentQuestion + 1} de {cincoSQuestions.length}
                </span>
                <span className="text-sm text-gray-500">
                  {Math.round(progress)}% concluído
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  <span className="text-blue-600 font-bold">{currentQ.category}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <h4 className="text-base font-medium mb-4">
                  {currentQ.question}
                </h4>

                <RadioGroup onValueChange={(value) => handleAnswer(parseInt(value))} className="space-y-3">
                  {[
                    { value: 5, label: "Excelente - Implementado completamente" },
                    { value: 4, label: "Bom - Implementado em grande parte" },
                    { value: 3, label: "Regular - Parcialmente implementado" },
                    { value: 2, label: "Ruim - Pouco implementado" },
                    { value: 1, label: "Muito Ruim - Não implementado" }
                  ].map((option) => (
                    <div key={option.value} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50">
                      <RadioGroupItem value={option.value.toString()} id={option.value.toString()} />
                      <Label htmlFor={option.value.toString()} className="flex-1 cursor-pointer">
                        <span className="font-medium text-blue-600 mr-2">({option.value})</span>
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}