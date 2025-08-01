
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

interface CkeditorComponentProps {
    className: string,
    onChange: (data: string) => void,
    value: string
}

const CKEditorComponent = ({
    className,
    onChange,
    value
}: CkeditorComponentProps) => {

    return (
        <div className={`editor-container ${className}`}>
            <CKEditor
                editor={ClassicEditor as any}
                data={value}
                config={{
                    toolbar: [
                        'heading',
                        '|',
                        'bold',
                        'italic',
                        'link',
                        'bulletedList',
                        'numberedList',
                        '|',
                        'outdent',
                        'indent',
                        '|',
                        'imageUpload',
                        'blockQuote',
                        'insertTable',
                        'mediaEmbed',
                        'undo',
                        'redo'
                    ]
                }}
                onReady={() => {
                }}
                onChange={(event, editor) => {
                    const data = editor.getData();
                    onChange(data)

                    console.log({ event, editor, data });
                }}
                onBlur={(editor) => {
                    console.log('Blur.', editor);
                }}
                onFocus={(editor) => {
                    console.log('Focus.', editor);
                }}
            />
        </div>
    );
};

export default CKEditorComponent;