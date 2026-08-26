from django.contrib import admin
from.models import Question, TestCase, Submission

class TestCaseInline(admin.TabularInline):
    model = TestCase
    extra = 1 
    fields = ('order', 'input_data', 'expected_output', 'is_hidden')

@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ('id', 'slug', 'title', 'difficulty', 'category', 'topic')
    list_filter = ('difficulty', 'category')
    search_fields = ('slug', 'title', 'topic')
    prepopulated_fields = {'slug': ('title',)} 
    inlines = [TestCaseInline]

@admin.register(TestCase)
class TestCaseAdmin(admin.ModelAdmin):
    list_display = ('id', 'question', 'order', 'is_hidden')
    list_filter = ('is_hidden',)

@admin.register(Submission)
class SubmissionAdmin(admin.ModelAdmin):
    list_display = ('id', 'question', 'status', 'score', 'created_at')
    readonly_fields = ('code',) 