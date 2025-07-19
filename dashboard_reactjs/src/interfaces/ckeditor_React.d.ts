// ckeditor-react.d.ts
declare module '@ckeditor/ckeditor5-react' {
    import * as React from 'react';

    export interface CKEditorProps {
        editor: any;
        data?: string;
        config?: any;
        id?: string;
        disabled?: boolean;
        onReady?: (editor: any) => void;
        onChange?: (event: any, editor: any) => void;
        onBlur?: (event: any, editor: any) => void;
        onFocus?: (event: any, editor: any) => void;
    }

    export const CKEditor: React.FC<CKEditorProps>;
}
