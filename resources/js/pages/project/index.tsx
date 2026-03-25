import ProjectIndex from '@/core-components/Project';
import { PaginatedResponse } from '@/types/laravel.type';
import { ProyekProps } from '@/types/project.type';

interface PropTypes {
    proyeks: PaginatedResponse<ProyekProps>;
    proyek?: any;
}

const ProjectPage = ({ proyeks, proyek }: PropTypes) => {
    return <ProjectIndex proyeks={proyeks} proyek={proyek} />;
};

export default ProjectPage;
