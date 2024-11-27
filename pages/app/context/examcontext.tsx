import React, { createContext, useContext, useState } from "react";

export type Exam = {
  id: number;
  name: string;
  professor: string;
  assistant: string;
  sala: string;
  ora: string;
  dataexamen: Date;
  grupa: string;
};

type ExamContextType = {
  homeExams: Exam[];
  teacherExams: Exam[];
  studentExams: Exam[];
  addExamToHome: (exam: Exam) => void;
  addExamToTeacher: (exam: Exam) => void;
  addExamsToStudentPage: (exam: Exam) => void;
  removeExamFromTeacher: (id: number) => void;
  removeExamFromStudent: (id: number) => void;
  updateExam: (id: number, updatedExam: Exam) => void;
};

type ExamProviderProps = {
  children: React.ReactNode;
};

const ExamContext = createContext<ExamContextType | undefined>(undefined);

export const useExams = () => {
  const context = useContext(ExamContext);
  if (!context) {
    throw new Error("useExams must be used within an ExamProvider");
  }
  return context;
};

export const ExamProvider: React.FC<ExamProviderProps> = ({ children }) => {
  const [homeExams, setHomeExams] = useState<Exam[]>([]); // Lista examene pentru Home
  const [studentExams, setStudentExams] = useState<Exam[]>([]);
  const [teacherExams, setTeacherExams] = useState<Exam[]>([]);

  const addExamToHome = (exam: Exam) => {
    setHomeExams((prevExams) => [...prevExams, exam]);
  };

  const addExamToTeacher = (exam: Exam) => {
    setTeacherExams((prevExams) => [...prevExams, exam]);
  };

  const addExamsToStudentPage = (exam: Exam) => {
    setStudentExams((prevExams) => [...prevExams, exam]);
  };

  const removeExamFromTeacher = (id: number) => {
    setTeacherExams((prevExams) => prevExams.filter((exam) => exam.id !== id));
  };

  const removeExamFromStudent = (id: number) => {
    setStudentExams((prevExams) => prevExams.filter((exam) => exam.id !== id));
  };

  const updateExam = (id: number, updatedExam: Exam) => {
    setStudentExams((prevExams) =>
      prevExams.map((exam) => (exam.id === id ? updatedExam : exam))
    );
    setTeacherExams((prevExams) =>
      prevExams.map((exam) => (exam.id === id ? updatedExam : exam))
    );
  };

  return (
    <ExamContext.Provider
      value={{
        homeExams,
        teacherExams,
        studentExams,
        addExamToHome,
        updateExam,
        addExamToTeacher,
        addExamsToStudentPage,
        removeExamFromTeacher,
        removeExamFromStudent,
      }}
    >
      {children}
    </ExamContext.Provider>
  );
};
