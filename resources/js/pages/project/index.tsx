import ProjectIndex from '@/core-components/Project';
import { PaginatedResponse } from '@/types/laravel.type';
import { ProyekProps } from '@/types/project.type';

interface PropTypes {
    proyeks: PaginatedResponse<ProyekProps>;
}

const ProjectPage = ({ proyeks }: PropTypes) => {
    return <ProjectIndex proyeks={proyeks} />;
};

export default ProjectPage;
