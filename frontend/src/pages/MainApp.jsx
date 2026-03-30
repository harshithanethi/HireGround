import { StackedSection } from '../components/StackedSection';
import CandidateUpload from './CandidateUpload';
import { CandidateSummary } from '../components/CandidateSummary';
import { EvaluationSection } from '../components/EvaluationSection';
import Analytics from './Analytics';

export default function MainApp() {
  return (
    <div className="w-full bg-gray-50 pb-[20vh]">
      {/* 
        The StackedSection wrappers will handle sticking the sections
        and scaling them down relative to scroll progress.
      */}
      <StackedSection id="upload" className="z-10">
        <div className="w-full h-full overflow-y-auto">
          <div className="max-w-4xl mx-auto w-full p-4 md:p-8">
            <CandidateUpload />
          </div>
        </div>
      </StackedSection>

      <StackedSection id="candidate" className="z-20 -mt-[20vh]">
        <div className="w-full h-full overflow-y-auto bg-gray-50/30">
          <CandidateSummary />
        </div>
      </StackedSection>

      <StackedSection id="evaluation" className="z-30 -mt-[20vh]">
        <div className="w-full h-full overflow-hidden bg-gray-50/30 flex flex-col">
          <EvaluationSection />
        </div>
      </StackedSection>

      <StackedSection id="insights" className="z-40 -mt-[20vh]">
        <div className="w-full h-full overflow-y-auto">
          {/* Reusing existing Analytics component, embedding it cleanly */}
          <div className="transform scale-[0.98] origin-top">
            <Analytics embedded={true} />
          </div>
        </div>
      </StackedSection>
      
    </div>
  );
}
