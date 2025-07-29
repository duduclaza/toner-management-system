import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FileText, User, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DISCQuestion {
  id: number;
  question: string;
  options: {
    D: string;
    I: string;
    S: string;
    C: string;
  };
}

const discQuestions: DISCQuestion[] = [
  {
    id: 1,
    question: "Em situações de pressão, eu tendo a:",
    options: {
      D: "Tomar decisões rápidas e assertivas",
      I: "Buscar apoio e motivar a equipe",
      S: "Manter a calma e estabilidade",
      C: "Analisar dados antes de agir"
    }
  },
  {
    id: 2,
    question: "Quando trabalho em equipe, eu prefiro:",
    options: {
      D: "Liderar e dirigir o grupo",
      I: "Facilitar a comunicação entre todos",
      S: "Apoiar e colaborar harmoniosamente",
      C: "Garantir que tudo seja feito corretamente"
    }
  },
  {
    id: 3,
    question: "Minha abordagem para resolver problemas é:",
    options: {
      D: "Ação direta e resultados rápidos",
      I: "Discussão aberta e criatividade",
      S: "Paciência e consideração cuidadosa",
      C: "Análise sistemática e precisão"
    }
  },
  {
    id: 4,
    question: "Em reuniões, eu costumo:",
    options: {
      D: "Assumir o controle e dirigir a discussão",
      I: "Contribuir com ideias e energizar o grupo",
      S: "Ouvir atentamente e dar suporte",
      C: "Apresentar fatos e dados relevantes"
    }
  },
  {
    id: 5,
    question: "Quando preciso convencer alguém:",
    options: {
      D: "Uso argumentos firmes e diretos",
      I: "Apelo para emoções e relacionamentos",
      S: "Mostro confiabilidade e consistência",
      C: "Apresento evidências e lógica"
    }
  }
  // Adicione mais 45 questões seguindo o mesmo padrão...
];

interface DISCQuestionnaireProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (results: DISCResults) => void;
}

interface DISCResults {
  funcionario: string;
  cargo: string;
  pontuacaoD: number;
  pontuacaoI: number;
  pontuacaoS: number;
  pontuacaoC: number;
  perfilPrimario: "D" | "I" | "S" | "C";
  dataAvaliacao: string;
}

export function DISCQuestionnaire({ isOpen, onClose, onComplete }: DISCQuestionnaireProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [funcionario, setFuncionario] = useState("");
  const [cargo, setCargo] = useState("");
  const [answers, setAnswers] = useState<Record<number, "D" | "I" | "S" | "C">>({});
  const [started, setStarted] = useState(false);
  
  const { toast } = useToast();

  const handleStart = () => {
    if (!funcionario || !cargo) {
      toast({ title: "Preencha nome e cargo para iniciar", variant: "destructive" });
      return;
    }
    setStarted(true);
  };

  const handleAnswer = (answer: "D" | "I" | "S" | "C") => {
    setAnswers(prev => ({ ...prev, [discQuestions[currentQuestion].id]: answer }));
    
    if (currentQuestion < discQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      // Calcular resultados
      const scores = { D: 0, I: 0, S: 0, C: 0 };
      Object.values(answers).forEach(answer => {
        scores[answer]++;
      });
      
      // Adicionar a última resposta
      scores[answer]++;
      
      // Converter para porcentagem
      const total = discQuestions.length;
      const pontuacaoD = Math.round((scores.D / total) * 100);
      const pontuacaoI = Math.round((scores.I / total) * 100);
      const pontuacaoS = Math.round((scores.S / total) * 100);
      const pontuacaoC = Math.round((scores.C / total) * 100);
      
      // Determinar perfil primário
      const maxScore = Math.max(pontuacaoD, pontuacaoI, pontuacaoS, pontuacaoC);
      let perfilPrimario: "D" | "I" | "S" | "C";
      if (maxScore === pontuacaoD) perfilPrimario = "D";
      else if (maxScore === pontuacaoI) perfilPrimario = "I";
      else if (maxScore === pontuacaoS) perfilPrimario = "S";
      else perfilPrimario = "C";
      
      const results: DISCResults = {
        funcionario,
        cargo,
        pontuacaoD,
        pontuacaoI,
        pontuacaoS,
        pontuacaoC,
        perfilPrimario,
        dataAvaliacao: new Date().toISOString().split('T')[0]
      };
      
      onComplete(results);
      reset();
    }
  };

  const reset = () => {
    setCurrentQuestion(0);
    setFuncionario("");
    setCargo("");
    setAnswers({});
    setStarted(false);
    onClose();
  };

  const progress = ((currentQuestion + 1) / discQuestions.length) * 100;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <User className="h-5 w-5 mr-2" />
            Questionário DISC
          </DialogTitle>
        </DialogHeader>

        {!started ? (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Avaliação de Perfil Comportamental</h3>
              <p className="text-gray-600 text-sm">
                Este questionário avalia seu perfil DISC através de {discQuestions.length} questões.
                Responda de forma honesta e intuitiva.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="funcionario">Nome do Funcionário</Label>
                <Input
                  id="funcionario"
                  value={funcionario}
                  onChange={(e) => setFuncionario(e.target.value)}
                  placeholder="Digite o nome completo"
                />
              </div>
              <div>
                <Label htmlFor="cargo">Cargo/Função</Label>
                <Input
                  id="cargo"
                  value={cargo}
                  onChange={(e) => setCargo(e.target.value)}
                  placeholder="Digite o cargo atual"
                />
              </div>
            </div>

            <div className="flex justify-center">
              <Button onClick={handleStart} className="px-8">
                Iniciar Questionário
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">
                  Questão {currentQuestion + 1} de {discQuestions.length}
                </span>
                <span className="text-sm text-gray-500">
                  {Math.round(progress)}% concluído
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            <Card>
              <CardContent className="p-6">
                <h4 className="text-lg font-medium mb-4">
                  {discQuestions[currentQuestion].question}
                </h4>

                <RadioGroup onValueChange={handleAnswer} className="space-y-3">
                  {Object.entries(discQuestions[currentQuestion].options).map(([key, option]) => (
                    <div key={key} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50">
                      <RadioGroupItem value={key} id={key} />
                      <Label htmlFor={key} className="flex-1 cursor-pointer">
                        <span className="font-medium text-blue-600 mr-2">({key})</span>
                        {option}
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