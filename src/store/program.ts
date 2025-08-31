import { create } from 'zustand';
import { Element, Program, DisciplineId } from '@/lib/types';
import { getDisciplineConfig } from '@/lib/rules';

interface ProgramStore {
  program: Program;
  setClass: (classId: string) => void;
  setDiscipline: (discipline: DisciplineId) => void;
  setElement: (index: number, element: Element) => void;
  clearElement: (index: number) => void;
  initializeElements: () => void;
  loadProgram: (program: Program) => void;
  resetProgram: () => void;
}

const initialProgram: Program = {
  classId: 'novice',
  discipline: 'SP',
  elements: []
};

export const useProgramStore = create<ProgramStore>((set, get) => ({
  program: initialProgram,
  
  setClass: (classId: string) => {
    set(state => ({
      program: {
        ...state.program,
        classId,
        elements: []
      }
    }));
    get().initializeElements();
  },
  
  setDiscipline: (discipline: DisciplineId) => {
    set(state => ({
      program: {
        ...state.program,
        discipline,
        elements: []
      }
    }));
    get().initializeElements();
  },
  
  setElement: (index: number, element: Element) => {
    set(state => {
      const newElements = [...state.program.elements];
      newElements[index] = element;
      return {
        program: {
          ...state.program,
          elements: newElements
        }
      };
    });
  },
  
  clearElement: (index: number) => {
    set(state => {
      const newElements = [...state.program.elements];
      newElements[index] = null;
      return {
        program: {
          ...state.program,
          elements: newElements
        }
      };
    });
  },
  
  initializeElements: () => {
    const state = get();
    const config = getDisciplineConfig(state.program.classId, state.program.discipline);
    if (config) {
      const elements = new Array(config.maxElements).fill(null);
      set({
        program: {
          ...state.program,
          elements
        }
      });
    }
  },
  
  loadProgram: (program: Program) => {
    set({ program });
  },
  
  resetProgram: () => {
    set({ program: initialProgram });
    get().initializeElements();
  }
}));