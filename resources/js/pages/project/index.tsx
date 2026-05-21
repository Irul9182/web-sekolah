import ProjectIndex from '@/core-components/Project';
import { PaginatedResponse } from '@/types/laravel.type';
import { ProyekProps, StatusProyek } from '@/types/project.type';

interface PropTypes {
    proyeks: PaginatedResponse<ProyekProps>;
    filters: {
        search: string;
        status: StatusProyek;
        per_page: number;
    };
}

const ProjectPage = ({ proyeks, filters }: PropTypes) => {
    return <ProjectIndex proyeks={proyeks} filters={filters} />;
};

export default ProjectPage;
