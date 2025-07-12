import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Bug, RefreshCw } from "lucide-react";
import { useTranslation } from "../contexts/TranslationContext";

export default function ErrorTest() {
  const { t } = useTranslation();

  const trigger404Error = async () => {
    try {
      await fetch('/api/nonexistent-endpoint');
    } catch (error) {
      console.error('404 test error:', error);
    }
  };

  const trigger500Error = async () => {
    try {
      await fetch('/api/test-error');
    } catch (error) {
      console.error('500 test error:', error);
    }
  };

  const triggerJSError = () => {
    // This will trigger the ErrorBoundary
    throw new Error('Test JavaScript error to trigger ErrorBoundary');
  };

  return (
    <div className="min-h-screen bg-black py-16">
      <div className="container-responsive max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            <span className="text-[#3b82f6]">Error</span>
            <span className="text-[#f89422]"> Testing Page</span>
          </h1>
          <p className="text-white/80 text-lg">
            Test different types of errors and error handling
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 404 Error Test */}
          <Card className="bg-black border-[#f89422] hover:border-[#f89422]/80 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#f89422]">
                <AlertTriangle className="h-5 w-5" />
                404 Error Test
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/80 mb-4">
                Test 404 error handling by calling a non-existent API endpoint.
              </p>
              <Button 
                onClick={trigger404Error}
                className="w-full bg-[#f89422] hover:bg-[#f89422]/90 text-black"
              >
                Trigger 404 Error
              </Button>
            </CardContent>
          </Card>

          {/* 500 Error Test */}
          <Card className="bg-black border-[#3b82f6] hover:border-[#3b82f6]/80 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#3b82f6]">
                <RefreshCw className="h-5 w-5" />
                500 Error Test
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/80 mb-4">
                Test server error handling by calling an endpoint that throws an error.
              </p>
              <Button 
                onClick={trigger500Error}
                className="w-full bg-[#3b82f6] hover:bg-[#3b82f6]/90 text-white"
              >
                Trigger 500 Error
              </Button>
            </CardContent>
          </Card>

          {/* JavaScript Error Test */}
          <Card className="bg-black border-red-500 hover:border-red-500/80 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-400">
                <Bug className="h-5 w-5" />
                JS Error Test
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/80 mb-4">
                Test React ErrorBoundary by throwing a JavaScript error.
              </p>
              <Button 
                onClick={triggerJSError}
                className="w-full bg-red-500 hover:bg-red-500/90 text-white"
              >
                Trigger JS Error
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <Card className="bg-black border-white/20">
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold text-[#f89422] mb-2">
                Instructions
              </h3>
              <ul className="text-white/80 text-left space-y-2">
                <li>• 404 test will make a network request to a non-existent endpoint</li>
                <li>• 500 test will call an API route that throws a server error</li>
                <li>• JS error test will trigger the React ErrorBoundary component</li>
                <li>• Check the browser console for error logs</li>
                <li>• Visit <code className="bg-white/10 px-1 rounded">/test-404</code> or <code className="bg-white/10 px-1 rounded">/test-500</code> to see error pages directly</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}